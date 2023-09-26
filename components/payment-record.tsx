import { ApiPayment } from "@/util/api-client/gen/Api";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
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
    <Box borderRadius={"md"} className={className}>
      <Flex>
        <Stat margin={"1"} flexGrow={1000}>
          <StatLabel>{payment.name}</StatLabel>
          <StatNumber fontSize={"large"}>{payment.price}円</StatNumber>
          <StatHelpText>{payment.payer?.name}さんが支払い</StatHelpText>
        </Stat>
        <Center>
          <IconButton margin={1} aria-label="edit" icon={<EditIcon />} />
          <IconButton aria-label="delete" icon={<DeleteIcon />} />
        </Center>
      </Flex>
    </Box>
  );
}
