import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { logger } from "./logger";

export async function embedAndStoreDocs(
  client: Pinecone,
  docs: Document<Record<string, any>>[],
  indexId: string,
  namespace: string,
) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(indexId);
    const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespace,
      textKey: "text",
    });
    await vectorStore.addDocuments(docs);
    return vectorStore;
  } catch (error) {
    logger.error(`Error embedding and storing docs: ${error}`);
    throw error;
  }
}

export async function getVectorStore(
  client: Pinecone,
  indexId: string,
  namespace: string,
) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(indexId);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: namespace,
      textKey: "text",
    });
    return vectorStore;
  } catch (error) {
    logger.error(`Error getting vector store: ${error}`);
    throw error;
  }
}
