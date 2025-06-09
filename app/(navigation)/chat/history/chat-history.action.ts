"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteChatHistoryAction = orgAction
  .schema(
    z.object({
      chatHistoryId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { chatHistoryId }, ctx }) => {
    // Only allow deletion if the chat history belongs to the user
    const chatHistory = await prisma.chatHistory.findUnique({
      where: { id: chatHistoryId },
      include: { member: true },
    });
    if (!chatHistory || chatHistory.member.userId !== ctx.user.id) {
      throw new Error("Chat history not found or not authorized");
    }
    await prisma.chatHistory.delete({
      where: { id: chatHistoryId },
    });
    revalidatePath(`/orgs/${ctx.org.slug}/chat/history`);
    return { success: true };
  });
