import Layout from "@/components/layout";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import styles from "./index.module.css";
import MemberRow from "./components/member-row";
import { useState } from "react";
import MemberInput from "./components/member-input";

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const addUser = (name: string) => {
    setUsers([...users, name]);
  };
  return (
    <>
      <Layout>
        <Heading as="h1" size="2xl" isTruncated>
          Walica Clone
        </Heading>

        <Text fontSize="l" className={styles.text}>
          割り勘を計算してくれるサービスであるWalicaを再現するプロジェクト、walica-cloneへようこそ
        </Text>

        <Text fontSize="l" className={styles.text}>
          以下にメンバーを追加してください
        </Text>

        <MemberInput addUser={addUser} className={styles.input} />

        <Box>
          {users.map((user, index) => (
            <MemberRow
              key={index}
              memberName={user}
              onDelete={() => {
                setUsers(users.filter((_, i) => i !== index));
              }}
            />
          ))}
          <Center>
            <Button colorScheme="teal" size="lg" className={styles.button}>
              割り勘グループを作成
            </Button>
          </Center>
        </Box>
      </Layout>
    </>
  );
}
