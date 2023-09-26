import { apiClient } from "@/util/api";
import { ApiPayment } from "@/util/api-client/gen/Api";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export function PaymentRecord({
  payment,
  className,
  eventId,
  showButtons = true,
  mutate,
}: {
  payment: ApiPayment;
  className?: string;
  eventId: string;
  showButtons?: boolean;
  mutate?: () => Promise<any>;
}): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure({});
  const [disableButtons, setDisableButtons] = React.useState<boolean>(false);
  const cancelRef = React.useRef(null);

  return (
    <Box borderRadius={"md"} className={className}>
      <Flex>
        <Stat margin={"1"} flexGrow={1000}>
          <StatLabel>{payment.name}</StatLabel>
          <StatNumber fontSize={"large"}>{payment.price}円</StatNumber>
          <StatHelpText>{payment.payer?.name}さんが支払い</StatHelpText>
        </Stat>
        {showButtons && (
          <>
            <Center>
              <IconButton
                margin={1}
                aria-label="edit"
                icon={<EditIcon />}
                onClick={() => {
                  router.push(`/group/${eventId}/${payment.id}/edit`);
                }}
              />
              <IconButton
                aria-label="delete"
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
            </Center>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent margin={4}>
                  <AlertDialogHeader>支払い履歴の削除</AlertDialogHeader>
                  <AlertDialogBody>
                    本当にこの支払い情報を削除しますか？ <br />
                    {`(${payment.name} ${payment.price}円)`}
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={onClose}
                      isLoading={disableButtons}
                    >
                      キャンセル
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={async () => {
                        setDisableButtons(true);
                        await apiClient.v1.walicaCloneApiDeletePayment({
                          paymentId: payment.id,
                        });
                        setDisableButtons(false);
                        onClose();
                        mutate?.();
                      }}
                      ml={3}
                      isLoading={disableButtons}
                    >
                      削除
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </Flex>
    </Box>
  );
}
