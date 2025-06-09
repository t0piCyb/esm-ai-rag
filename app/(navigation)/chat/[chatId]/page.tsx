import { Chat } from "@/features/chat/chat";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams<{ chatId: string }>) {
  const { chatId } = await props.params;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Chat</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Chat chatHistoryId={chatId} />
      </LayoutContent>
    </Layout>
  );
}
