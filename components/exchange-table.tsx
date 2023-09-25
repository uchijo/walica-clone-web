import { ApiExchange } from "@/util/api-client/gen/Api";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
} from "@chakra-ui/react";

export function ExchangeTable({
  exchanges,
}: {
  exchanges: ApiExchange[];
}): JSX.Element {
  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">精算結果</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />}>
            {exchanges.map((exchange, index) => (
              <Stat key={index}>
                <StatNumber>{exchange.price}円</StatNumber>
                <StatHelpText>
                  {exchange.payer?.name}さん <ArrowForwardIcon />{" "}
                  {exchange.payee?.name}さん
                </StatHelpText>
              </Stat>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
