import Layout from "@/components/layout";
import { PaymentRecord } from "@/components/payment-record";
import { apiClient } from "@/util/api";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styles from "./index.module.css";
import { ExchangeTable } from "@/components/exchange-table";
import { ArrowLeftIcon, CopyIcon } from "@chakra-ui/icons";

export default function GroupTop() {
  const router = useRouter();
  const id = router.query.id;
  const {
    data: eventData,
    error: eventError,
    isLoading: isEventLoading,
    mutate,
  } = useSWR(["event", id], ([_, id]: string[]) => fetcher(id));
  const toast = useToast();

  if (eventError) {
    return <div>failed to load</div>;
  }

  if (isEventLoading) {
    return <div>loading...</div>;
  }

  return (
    <Layout>
      <IconButton
        aria-label={"go back to home"}
        onClick={() => router.push("/")}
      >
        <ArrowLeftIcon />
      </IconButton>
      <Center>
        <Heading as="h1" size="xl" isTruncated>
          {eventData?.eventName}
        </Heading>
      </Center>

      <Center>
        <Button
          colorScheme="teal"
          size="lg"
          className={styles.addButton}
          onClick={() => {
            router.push(`/group/${id}/add`);
          }}
        >
          支払い履歴を追加する
        </Button>
      </Center>

      <Center>
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/group/${id}`
              );
              toast({
                title: "リンクをコピーしました",
                description: "友達にシェアしよう！",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            } catch (_) {
              toast({
                title: "リンクのコピーに失敗しました",
                description: "もう一度お試しください",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          }}
        >
          このページのリンクをコピー
          <CopyIcon ml={2} />
        </Button>
      </Center>

      <Box className={styles.box}>
        <ExchangeTable exchanges={eventData?.exchanges ?? []} />
      </Box>

      <Card>
        <CardHeader>
          <Heading as="h1" size="md">
            支払い履歴
          </Heading>
        </CardHeader>
        <CardBody>
          {eventData?.payments
            ?.map((payment, index) => (
              <PaymentRecord
                key={index}
                payment={payment}
                eventId={id as string}
                className={styles.paymentRecordRow}
                mutate={mutate}
              />
            ))
            .toReversed()}
        </CardBody>
      </Card>
    </Layout>
  );
}

const fetcher = async (id?: string) => {
  if (!id) {
    return;
  }
  const result = await apiClient.v1.walicaCloneApiReadInfo({ id }, {});
  return result.data;
};
