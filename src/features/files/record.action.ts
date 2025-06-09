"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { logger } from "@/lib/logger";
import { getPineconeClient } from "@/lib/pinecone-client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RecordSchema = z.object({
  id: z.string(),
  values: z.array(z.number()),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const createRecordAction = orgAction
  .schema(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
      record: RecordSchema,
    }),
  )
  .action(async ({ parsedInput: { indexId, namespaceName, record }, ctx }) => {
    try {
      const validatedRecord = RecordSchema.parse(record);

      const pinecone = await getPineconeClient(ctx.org.slug);
      const index = pinecone.Index(indexId);
      const namespace = index.namespace(namespaceName);

      await namespace.upsert([
        {
          id: validatedRecord.id,
          values: validatedRecord.values,
          metadata: validatedRecord.metadata,
        },
      ]);

      revalidatePath(
        `/api/pinecone/indexes/${indexId}/namespaces/${namespaceName}/records`,
      );
      return { success: true };
    } catch (error) {
      logger.error("Error creating record:", error);
      throw new Error(`Failed to create record: ${error}`);
    }
  });

export const updateRecordAction = orgAction
  .schema(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
      record: RecordSchema,
    }),
  )
  .action(async ({ parsedInput: { indexId, namespaceName, record }, ctx }) => {
    try {
      const validatedRecord = RecordSchema.parse(record);

      const pinecone = await getPineconeClient(ctx.org.slug);
      const index = pinecone.Index(indexId);
      const namespace = index.namespace(namespaceName);

      await namespace.update({
        id: validatedRecord.id,
        values: validatedRecord.values,
        metadata: validatedRecord.metadata,
      });

      revalidatePath(
        `/api/pinecone/indexes/${indexId}/namespaces/${namespaceName}/records`,
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating record:", error);
      throw new Error(`Failed to update record: ${error}`);
    }
  });

export const deleteRecordAction = orgAction
  .schema(
    z.object({
      indexId: z.string(),
      namespaceName: z.string(),
      recordId: z.string(),
    }),
  )
  .action(
    async ({ parsedInput: { indexId, namespaceName, recordId }, ctx }) => {
      try {
        const pinecone = await getPineconeClient(ctx.org.slug);
        const index = pinecone.Index(indexId);
        const namespace = index.namespace(namespaceName);

        await namespace.deleteOne(recordId);

        revalidatePath(
          `/api/pinecone/indexes/${indexId}/namespaces/${namespaceName}/records`,
        );
        return { success: true };
      } catch (error) {
        console.error("Error deleting record:", error);
        throw new Error(`Failed to delete record: ${error}`);
      }
    },
  );
