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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styles from "./index.module.css";
<<<<<<< HEAD
import { ExchangeTable } from "@/components/exchange-table";
=======
>>>>>>> 7377a6d... 支払履歴が表示できるようになった

export default function GroupTop() {
  const router = useRouter();
  const id = router.query.id;
  const {
    data: eventData,
    error: eventError,
    isLoading: isEventLoading,
    mutate,
  } = useSWR(id, fetcher);

  if (eventError) {
    return <div>failed to load</div>;
  }

  if (isEventLoading) {
    return <div>loading...</div>;
  }

  return (
    <Layout>
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
