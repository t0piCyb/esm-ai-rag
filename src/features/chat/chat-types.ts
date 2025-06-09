import { Prisma } from "@/generated/prisma";

export type ChatHistoryWithMessagesAndSources = Prisma.ChatHistoryGetPayload<{
  include: {
    messages: {
      include: {
        sources: true;
      };
    };
  };
}>;
