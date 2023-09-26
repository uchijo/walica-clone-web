import Layout from "@/components/layout";
import { apiClient } from "@/util/api";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Spacer,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

export default function AddPayment() {
  const router = useRouter();
  const id = router.query.id;
  const [payer, setPayer] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [payees, setPayees] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const {
    data: users,
    error: userError,
    isLoading: isUserLoading,
  } = useSWR(id, eventFetcher);
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
    const response = await apiClient.v1.walicaCloneApiAddPayment({
      eventId: id as string,
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
    router.push(`/group/${id}`);
  };

  if (userError) {
    return <div>failed to load</div>;
  }

  if (isUserLoading) {
    return <div>loading...</div>;
  }

  return (
    <Layout>
      <FormControl>
        <Heading as="h1" size="md">
          支払い履歴の追加
        </Heading>
        <Flex marginTop={4}>
          <Select
            placeholder="支払った人を選択"
            onChange={(e) => {
              setPayer(e.target.value);
            }}
            required
          >
            {users?.map((user, index) => (
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
        <Flex marginTop={4} justifyContent={"space-around"}>
          <Button
            onClick={() => {
              router.push(`/group/${id}`);
            }}
          >
            記録せずに戻る
          </Button>
          <Button colorScheme="teal" onClick={onSubmit} isLoading={isLoading}>
            記録する
          </Button>
        </Flex>
      </FormControl>
    </Layout>
  );
}

export const eventFetcher = async (id: string) => {
  const res = await apiClient.v1.walicaCloneApiReadAllUsers({ eventId: id });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data.users;
};

export const validatePaymentForm = ({
  payer,
  payees,
  itemName,
  price,
}: {
  payer: string;
  payees: string[];
  itemName: string;
  price: number;
}): { ok: boolean; errorTitle?: string; errorMessage?: string } => {
  if (payer === "") {
    return {
      ok: false,
      errorTitle: "支払った人がいません",
      errorMessage: "支払った人を選択してください",
    };
  }
  if (payees.length === 0) {
    return {
      ok: false,
      errorTitle: "支払い相手がいません",
      errorMessage: "支払い相手を選択してください",
    };
  }
  if (itemName === "") {
    return {
      ok: false,
      errorTitle: "買ったものがありません",
      errorMessage: "買ったものを入力してください",
    };
  }
  if (price === 0) {
    return {
      ok: false,
      errorTitle: "金額が0円です",
      errorMessage: "金額を入力してください",
    };
  }
  if (price < 0) {
    return {
      ok: false,
      errorTitle: "金額がマイナスです",
      errorMessage: "金額を正しく入力してください",
    };
  }
  if (price % 1 !== 0) {
    return {
      ok: false,
      errorTitle: "金額が小数です",
      errorMessage: "金額を正しく入力してください",
    };
  }
  return { ok: true };
};
