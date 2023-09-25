import {
  Card,
  CardBody,
  Center,
  Flex,
  IconButton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import styles from "./member-row.module.css";

export default function MemberRow({
  memberName,
  onDelete,
}: {
  memberName: string;
  onDelete?: () => void;
}) {
  return (
    <>
      <Card maxWidth={"30rem"} className={styles.box}>
        <CardBody margin={"-3"} marginLeft={"-1"}>
          <Flex direction={"row"}>
            <Center>
              <Text>{memberName}</Text>
            </Center>
            <Spacer />
            <IconButton
              aria-label="delete"
              icon={<DeleteIcon />}
              onClick={onDelete}
            />
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
