import { prisma } from "@/lib/prisma";
import { route } from "@/lib/safe-route";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      orgId: z.string(),
    }),
  )
  .handler(async (req, { params, ctx }) => {
    const chatsHistory = await prisma.chatHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(chatsHistory), { status: 200 });
  });
