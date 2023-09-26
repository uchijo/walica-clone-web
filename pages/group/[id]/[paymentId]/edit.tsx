import Layout from "@/components/layout";
import {
  FormControl,
  Heading,
  Flex,
  Select,
  Center,
  Stack,
  Switch,
  Spacer,
  Input,
  Button,
  useToast,
  Box,
  Text,
  Divider,
  ListItem,
  UnorderedList,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import useSWR from "swr";
import { eventFetcher, validatePaymentForm } from "../add";
import { useState } from "react";
import { apiClient } from "@/util/api";
import { useRouter } from "next/router";
import { PaymentRecord } from "@/components/payment-record";

export default function EditPayment() {
  const router = useRouter();
  const eventId = router.query.id;
  const paymentId = router.query.paymentId;
  const [payer, setPayer] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [payees, setPayees] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const {
    data: users,
    error: eventError,
    isLoading: isEventLoading,
  } = useSWR(eventId, eventFetcher);
  const {
    data: payment,
    error: paymentError,
    isLoading: isPaymentLoading,
  } = useSWR(paymentId, paymentFetcher);

  const onSubmit = async () => {
    const { ok, errorTitle, errorMessage } = validatePaymentForm({
      payer,
      payees,
      itemName,
      price,
    });
    if (!ok) {
      toast({
        title: errorTitle,
        description: errorMessage,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    const response = await apiClient.v1.walicaCloneApiUpdatePayment({
      paymentId: paymentId as string,
      payerId: payer,
      payeeIds: payees,
      name: itemName,
      price: price,
    });
    setIsLoading(false);
    if (response.error) {
      toast({
        title: "支払い履歴の追加に失敗しました",
        description: "しばらくしてからもう一度お試しください",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    router.push(`/group/${eventId}`);
  };

  if (isEventLoading || isPaymentLoading) {
    return <div>loading...</div>;
  }

  if (eventError || paymentError || !payment || !users) {
    return <div>failed to load</div>;
  }

  return (
    <Layout>
      <FormControl>
        <Center>
          <Heading as="h1" size="md">
            支払い履歴の編集
          </Heading>
        </Center>

        <Card marginTop={4} marginBottom={4}>
          <CardHeader>
            <Heading as="h2" size="sm">
              現在の支払い履歴
            </Heading>
          </CardHeader>
          <CardBody>
            <PaymentRecord
              payment={payment}
              eventId={eventId as string}
              showButtons={false}
            />

            <Divider marginTop={4} marginBottom={4} colorScheme="gray" />

            <Text>支払ってもらった人</Text>
            <UnorderedList>
              {payment.payees?.map((payee, index) => (
                <ListItem key={index}>{payee.name}</ListItem>
              ))}
            </UnorderedList>
          </CardBody>
        </Card>

        <Heading as="h2" size="sm">
          編集
        </Heading>
        <Flex marginTop={4}>
          <Select
            placeholder="支払った人を選択"
            onChange={(e) => {
              setPayer(e.target.value);
            }}
            required
            value={payer}
          >
            {users.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
          <Center>
            <Text whiteSpace={"nowrap"} marginLeft={3}>
              さんが
            </Text>
          </Center>
        </Flex>
        <Flex marginTop={4}>
          <Box>
            {users?.map((user, index) => (
              <Box key={index} margin={2}>
                <Stack direction={"row"}>
                  <Switch
                    onChange={(e) => {
                      if (!user?.id) {
                        return;
                      }
                      if (e.target.checked) {
                        setPayees([...payees, user.id]);
                      } else {
                        setPayees(payees.filter((id) => id !== user.id));
                      }
                    }}
                    isChecked={payees.includes(user.id ?? "")}
                  />
                  <Center>
                    <Text>{user.name}</Text>
                  </Center>
                </Stack>
              </Box>
            ))}
          </Box>
          <Spacer />
          <Center>
            <Text whiteSpace={"nowrap"} marginLeft={3}>
              の分の
            </Text>
          </Center>
        </Flex>
        <Flex marginTop={4}>
          <Input
            placeholder="買ったもの"
            required
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
          <Center>
            <Text whiteSpace={"nowrap"} marginLeft={3}>
              のために
            </Text>
          </Center>
        </Flex>
        <Flex marginTop={4}>
          <Input
            placeholder="金額"
            step={1}
            type="number"
            required
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
          />
          <Center>
            <Text whiteSpace={"nowrap"} marginLeft={3}>
              円分支払った
            </Text>
          </Center>
        </Flex>
        <Flex margin={8} justifyContent={"space-around"}>
          <Button
            onClick={() => {
              router.push(`/group/${eventId}`);
            }}
          >
            編集せずに戻る
          </Button>
          <Button colorScheme="teal" onClick={onSubmit} isLoading={isLoading}>
            記録する
          </Button>
        </Flex>
      </FormControl>
    </Layout>
  );
}

const paymentFetcher = async (paymentId: string) => {
  const response = await apiClient.v1.walicaCloneApiReadPayment({ paymentId });
  if (response.error) {
    throw new Error("failed to load");
  }
  return response.data.payment;
};
