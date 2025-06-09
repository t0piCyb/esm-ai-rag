import { getPineconeClient } from "@/lib/pinecone-client";
import { route } from "@/lib/safe-route";

export const GET = route.handler(async (req, { ctx }) => {
  const pinecone = await getPineconeClient("default");

  const indexes = await pinecone.listIndexes();

  return Response.json(indexes);
});
