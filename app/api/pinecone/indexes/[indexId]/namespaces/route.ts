import { getPineconeClient } from "@/lib/pinecone-client";
import { indexRoute } from "@/lib/safe-route";
import { z } from "zod";
export const GET = indexRoute
  .params(
    z.object({
      indexId: z.string(),
    }),
  )
  .handler(async (req, ctx) => {
    const indexId = ctx.params.indexId;
    const pinecone = await getPineconeClient("default");
    const index = pinecone.Index(indexId);

    const indexStats = await index.describeIndexStats();
    const namespaces = indexStats.namespaces
      ? Object.keys(indexStats.namespaces)
      : [];

    return Response.json(namespaces);
  });
