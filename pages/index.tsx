import Layout from "@/components/layout";
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import styles from "./index.module.css";
import MemberRow from "./components/member-row";
import { useState } from "react";
import MemberInput from "./components/member-input";
import { apiClient } from "@/util/api";
import { useRouter } from "next/router";

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
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

        <Input
          placeholder="イベント名"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

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
            <Button
              colorScheme="teal"
              size="lg"
              className={styles.button}
              isLoading={isCreatingRoom}
              onClick={async () => {
                setIsCreatingRoom(true);

                if (users.length === 0) {
                  setIsCreatingRoom(false);
                  toast({
                    title: "メンバーがいません",
                    description: "メンバーを追加してください",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  return;
                }

                if (eventName === "") {
                  setIsCreatingRoom(false);
                  toast({
                    title: "イベント名がありません",
                    description: "イベント名を入力してください",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  return;
                }

                const response = await apiClient.v1.walicaCloneApiCreateEvent({
                  name: eventName,
                  members: users,
                });
                const eventId = response.data?.id;

                if (response.error || !eventId) {
                  setIsCreatingRoom(false);
                  toast({
                    title: "イベントの作成に失敗しました",
                    description: "しばらくしてからもう一度お試しください",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  return;
                }

                router.push(`/group/${eventId}`);
              }}
            >
              割り勘グループを作成
            </Button>
          </Center>
        </Box>
      </Layout>
    </>
  );
}
