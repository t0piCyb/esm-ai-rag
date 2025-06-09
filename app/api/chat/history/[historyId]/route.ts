import { ChatHistoryWithMessagesAndSources } from "@/features/chat/chat-types";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/safe-route";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      historyId: z.string(),
    }),
  )
  .handler(
    async (
      req,
      { params, ctx },
    ): Promise<
      | NextResponse<ChatHistoryWithMessagesAndSources>
      | NextResponse<{ error: string }>
    > => {
      const chatHistory = await prisma.chatHistory.findUnique({
        where: {
          id: params.historyId,
        },
        include: {
          messages: {
            include: {
              sources: true,
            },
          },
        },
      });

      if (!chatHistory) {
        return NextResponse.json(
          { error: "Chat history not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(chatHistory);
    },
  );
