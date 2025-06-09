import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { requiredAuth } from "@/lib/auth/auth-session";
import { prisma } from "@/lib/prisma";
import { PageParams } from "@/types/next";
import Link from "next/link";
import { ChatHistoryItem } from "./chat-history-item";

export default async function ChatHistoryPage({
  params,
}: PageParams<{ orgSlug: string }>) {
  const session = await requiredAuth();
  const { orgSlug } = await params;
  const chatHistories = await prisma.chatHistory.findMany({
    where: {
      member: {
        organization: {
          slug: orgSlug,
        },
        userId: session.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Chat History</LayoutTitle>
        <LayoutActions>
          <Button asChild>
            <Link href={`/orgs/${orgSlug}/chat`}>New Chat</Link>
          </Button>
        </LayoutActions>
        <LayoutDescription>
          Find here all the chats you have had with the AI.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <div className="grid gap-4">
          {chatHistories.length ? (
            chatHistories.map((chatHistory) => (
              <ChatHistoryItem
                key={chatHistory.id}
                orgSlug={orgSlug}
                chatHistory={chatHistory}
              />
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No chat history found
            </div>
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}
