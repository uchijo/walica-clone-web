import Layout from "@/components/layout";
import { apiClient } from "@/util/api";
import { Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";

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
      <Box>
        <Heading as="h1" size="lg" isTruncated>支払い履歴</Heading>
        {eventData?.payments?.map((payment, index) => (
          <div key={index}>
            <div>
              {payment?.name} {payment?.price}円
            </div>
            <div>支払い者: {payment?.payer?.name}</div>
            <div>
              払ってもらった人:{" "}
              {payment?.payees?.map((payee, index) => (
                <span key={index}>{payee?.name} </span>
              ))}
            </div>
          </div>
        ))}
      </Box>
      精算： <br />
      {eventData?.exchanges?.map((exchange, index) => (
        <div key={index}>
          <div>
            {exchange?.payer?.name}さんが{exchange?.payee?.name}に
            {exchange?.price}円払う
          </div>
        </div>
      ))}
      <br />
      各人の消費量 <br />
      {eventData?.summaries?.map((sumary, index) => (
        <div key={index}>
          <div>
            {sumary?.user?.name} {sumary?.totalExpense}円消費
          </div>
        </div>
      ))}
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
