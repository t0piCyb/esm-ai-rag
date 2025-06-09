import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/safe-route";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
    }),
  )
  .handler(async (req, { params }): Promise<NextResponse> => {
    const { indexId, namespaceName } = params;
    logger.info(`indexId: ${indexId}, namespaceName: ${namespaceName}`);
    const files = await prisma.namespaceDocument.findMany({
      where: {
        namespaceId: namespaceName,
        indexId: indexId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(files);
  });
