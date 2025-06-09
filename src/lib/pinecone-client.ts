"use server";

import { Pinecone, ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { env } from "./env";
import { logger } from "./logger";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: env.PINECONE_CLOUD as ServerlessSpecCloudEnum,
          region: env.PINECONE_REGION,
        },
      },
    });

    logger.info(`Index ${indexName} creating`);
    await delay(1000);
    logger.info(`Index ${indexName} created`);
  } catch (error) {
    logger.error(`Error creating index ${indexName}: ${error}`);
    throw error;
  }
}

export async function initPineconeClient(indexName: string) {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    const existingIndex = await pineconeClient.listIndexes();
    if (!existingIndex.indexes?.some((index) => index.name === indexName)) {
      await createIndex(pineconeClient, indexName);
    }

    return pineconeClient;
  } catch (error) {
    logger.error(`Error initializing Pinecone client: ${error}`);
    throw error;
  }
}

export async function getPineconeClient(indexName: string) {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient(indexName);
  }
  return pineconeClientInstance;
}
