import { getPineconeClient } from "@/lib/pinecone-client";
import { indexRoute } from "@/lib/safe-route";
import { z } from "zod";

export const GET = indexRoute
  .params(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
      recordId: z.string(),
    }),
  )
  .handler(async (req, ctx) => {
    const { indexId, namespaceName, recordId } = ctx.params;

    try {
      const pinecone = await getPineconeClient("default");
      const index = pinecone.Index(indexId);
      const namespace = index.namespace(namespaceName);

      const result = await namespace.fetch([recordId]);

      if (!result.records || !result.records[recordId]) {
        return new Response(null, { status: 404 });
      }

      return Response.json(result.records[recordId]);
    } catch (error) {
      console.error("Error fetching record:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch record" }), {
        status: 500,
      });
    }
  });
