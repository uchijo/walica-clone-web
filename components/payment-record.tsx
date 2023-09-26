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
import { useRouter } from "next/router";

export function PaymentRecord({
  payment,
  className,
  eventId,
  showButtons = true,
}: {
  payment: ApiPayment;
  className?: string;
  eventId: string;
  showButtons?: boolean;
}): JSX.Element {
  const router = useRouter();
  return (
    <Box borderRadius={"md"} className={className}>
      <Flex>
        <Stat margin={"1"} flexGrow={1000}>
          <StatLabel>{payment.name}</StatLabel>
          <StatNumber fontSize={"large"}>{payment.price}円</StatNumber>
          <StatHelpText>{payment.payer?.name}さんが支払い</StatHelpText>
        </Stat>
        {showButtons && (
          <Center>
            <IconButton
              margin={1}
              aria-label="edit"
              icon={<EditIcon />}
              onClick={() => {
                router.push(`/group/${eventId}/${payment.id}/edit`);
              }}
            />
            <IconButton aria-label="delete" icon={<DeleteIcon />} />
          </Center>
        )}
      </Flex>
    </Box>
  );
}
