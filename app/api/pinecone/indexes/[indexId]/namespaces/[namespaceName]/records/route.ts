import { logger } from "@/lib/logger";
import { getPineconeClient } from "@/lib/pinecone-client";
import { indexRoute } from "@/lib/safe-route";
import { ListResponse } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = indexRoute
  .params(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
    }),
  )
  .query(
    z.object({
      limit: z.coerce.number().optional(),
      next: z.string().optional(),
    }),
  )
  .handler(
    async (
      req,
      ctx,
    ): Promise<
      NextResponse<ListResponse> | NextResponse<{ error: string }>
    > => {
      const { indexId, namespaceName } = ctx.params;
      const { limit = 10, next } = ctx.query;

      try {
        const pinecone = await getPineconeClient("default");
        const index = pinecone.Index(indexId);
        const namespace = index.namespace(namespaceName);

        const records = await namespace.listPaginated({
          limit,
          paginationToken: next,
        });

        return NextResponse.json(records);
      } catch (error) {
        logger.error("Error fetching records:", error);
        return NextResponse.json(
          { error: "Failed to fetch records" },
          { status: 500 },
        );
      }
    },
  );
