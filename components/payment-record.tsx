import { ApiPayment } from "@/util/api-client/gen/Api";
import {
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

export function PaymentRecord({
  payment,
  className,
}: {
  payment: ApiPayment;
  className?: string;
}): JSX.Element {
  return (
    <Box
      border="1px"
      borderRadius={"md"}
      borderColor={"blackAlpha.600"}
      className={className}
    >
      <Stat margin={"1"}>
        <StatLabel>{payment.name}</StatLabel>
        <StatNumber fontSize={"large"}>{payment.price}円</StatNumber>
        <StatHelpText>{payment.payer?.name}さんが支払い</StatHelpText>
      </Stat>
    </Box>
  );
}
