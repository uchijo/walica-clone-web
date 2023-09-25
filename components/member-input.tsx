import { Button, Flex, Input, Spacer, Stack } from "@chakra-ui/react";
import { useState } from "react";
import styles from "./member-input.module.css";

export default function MemberInput({
  addUser,
  className,
}: {
  addUser: (name: string) => void;
  className?: string;
}) {
  const [name, setName] = useState("");
  return (
    <div className={className}>
      <Flex>
        <Input
          placeholder="メンバー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          colorScheme="teal"
          size="md"
          type="submit"
          onClick={() => {
            addUser(name);
            setName("");
          }}
          className={styles.button}
        >
          追加
        </Button>
      </Flex>
    </div>
  );
}
