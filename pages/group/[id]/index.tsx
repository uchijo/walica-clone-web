import Layout from "@/components/layout";
import { PaymentRecord } from "@/components/payment-record";
import { apiClient } from "@/util/api";
import { Box, Heading } from "@chakra-ui/react";
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
  } = useSWR(id, fetcher);

  if (eventError) {
    return <div>failed to load</div>;
  }

  if (isEventLoading) {
    return <div>loading...</div>;
  }

  return (
    <Layout>
      <Box className={styles.box}>
        <Heading as="h1" size="lg" isTruncated>
          支払い履歴
        </Heading>
        {eventData?.payments?.map((payment, index) => (
          <PaymentRecord
            key={index}
            payment={payment}
            className={styles.paymentRecordRow}
          />
        ))}
      </Box>
      <Box className={styles.box}>
        <ExchangeTable exchanges={eventData?.exchanges ?? []} />
      </Box>
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
