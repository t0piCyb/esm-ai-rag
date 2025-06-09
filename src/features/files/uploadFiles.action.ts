"use server";

import { zfd } from "zod-form-data";

import { action } from "@/lib/actions/safe-actions";
import { getPineconeClient } from "@/lib/pinecone-client";
import { prisma } from "@/lib/prisma";
import { getChunkedDocsFromText } from "@/lib/text-loader";
import { getVectorStore } from "@/lib/vectore-store";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Helper function to sanitize file names for vector IDs
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace non-alphanumeric chars with underscore
    .replace(/_{2,}/g, "_"); // Replace multiple consecutive underscores with single one
};

export const uploadFilesAction = action
  .schema(
    zfd.formData({
      namespace: zfd.text(),
      docs: zfd.file().array(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const pineconeClient = await getPineconeClient("default");
    const vectorStore = await getVectorStore(
      pineconeClient,
      "default",
      parsedInput.namespace,
    );

    await Promise.all(
      parsedInput.docs.map(async (file) => {
        const docsChunks = await getChunkedDocsFromText(file);
        const sanitizedFileName = sanitizeFileName(file.name);
        const ids = docsChunks.map(
          (doc, index) => `${sanitizedFileName}#chunk${index}`,
        );
        await vectorStore.addDocuments(docsChunks, ids);
        await prisma.namespaceDocument.create({
          data: {
            name: sanitizedFileName,
            namespaceId: parsedInput.namespace,
            indexId: "default",
          },
        });
      }),
    );

    revalidatePath(
      `/files?namespace=${parsedInput.namespace}&index=${"default"}`,
    );

    return {
      success: true,
    };
  });

export const deleteDocumentAction = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const document = await prisma.namespaceDocument.findUnique({
      where: { id: parsedInput.id },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const pineconeClient = await getPineconeClient("default");
    const index = pineconeClient
      .Index(document.indexId)
      .namespace(document.namespaceId);
    const pageOneList = await index.listPaginated({
      prefix: document.name,
    });
    const pageOneVectorIds = pageOneList.vectors?.map((vector) => vector.id);
    if (pageOneVectorIds) {
      await index.deleteMany(pageOneVectorIds);
    }
    let paginationToken = pageOneList.pagination?.next;
    while (paginationToken) {
      const nextPageList = await index.listPaginated({
        prefix: document.name,
        paginationToken,
      });
      const nextPageVectorIds = nextPageList.vectors?.map(
        (vector) => vector.id,
      );
      if (nextPageVectorIds) {
        await index.deleteMany(nextPageVectorIds);
      }
      paginationToken = nextPageList.pagination?.next;
    }

    const result = await prisma.namespaceDocument.deleteMany({
      where: {
        OR: [
          { id: parsedInput.id },
          {
            name: document.name,
            namespaceId: document.namespaceId,
            indexId: "default",
          },
        ],
      },
    });

    revalidatePath(
      `/files?namespace=${document.namespaceId}&index=${"default"}`,
    );

    return {
      success: true,
    };
  });
