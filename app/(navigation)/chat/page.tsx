import { Chat } from "@/features/chat/chat";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { combineWithParentMetadata } from "@/lib/metadata";
import type { PageParams } from "@/types/next";

export const generateMetadata = combineWithParentMetadata({
  title: "Chat",
  description: "Chat with your chatbot specialist of your class",
});

export default async function RoutePage(props: PageParams) {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Chat</LayoutTitle>
        <LayoutDescription>
          Chat with your chatbot specialist of your class
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions className="flex gap-2"></LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <Chat />
      </LayoutContent>
    </Layout>
  );
}
