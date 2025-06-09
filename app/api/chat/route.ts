import { SYSTEM_PROMPT } from "@/features/chat/prompt";
import { logger } from "@/lib/logger";
import { getPineconeClient } from "@/lib/pinecone-client";
import { prisma } from "@/lib/prisma";
import { QA_TEMPLATE } from "@/lib/prompt-template";
import { route } from "@/lib/safe-route";
import { getVectorStore } from "@/lib/vectore-store";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, streamText } from "ai";
import { formatDocumentsAsString } from "langchain/util/document";
import { NextResponse } from "next/server";
import { z } from "zod";

// const formatMessage = (message: Message) => {
//   return `${message.role === "user" ? "Human" : "Assistant"}: ${
//     message.content
//   }`;
// };

export const POST = route
  .body(
    z.object({
      messages: z.array(
        z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
      ),
      chatHistoryId: z.string().nullable().optional(),
      tag: z.string().nullable().optional(),
    }),
  )
  .handler(async (req, { params, body, ctx }) => {
    const { messages, chatHistoryId, tag } = body;
    const question = messages[messages.length - 1].content;
    if (!question) {
      return new Response("No question provided", { status: 400 });
    }

    try {
      // Get or create chat history
      let chatHistory = chatHistoryId
        ? await prisma.chatHistory.findUnique({ where: { id: chatHistoryId } })
        : await prisma.chatHistory.create({
            data: {
              title:
                question.slice(0, 50) + (question.length > 50 ? "..." : ""),
            },
          });

      if (!chatHistory) {
        return new Response("Chat history not found", { status: 404 });
      }

      // Save the user message
      await prisma.chatMessage.create({
        data: {
          content: question,
          role: "user",
          chatHistoryId: chatHistory.id,
        },
      });

      const namespace = "default"; // TODO: get the namespace associate to the user
      const pineconeClient = await getPineconeClient("default");
      const vectorStore = await getVectorStore(
        pineconeClient,
        "default",
        namespace,
      );
      const retriever = vectorStore.asRetriever();

      return createDataStreamResponse({
        execute: async (dataStream) => {
          // Fetch documents from retriever
          const docs = await retriever.invoke(question);
          // Write sources to the dataStream
          docs.forEach((doc, index) => {
            dataStream.writeSource({
              sourceType: "url",
              id: `source-${index}`,
              title: doc.metadata?.title || `Source ${index + 1}`,
              url: doc.metadata?.url || "#",
            });

            // Store source content as separate data
            dataStream.writeData({
              sourceId: `source-${index}`,
              content: doc.pageContent,
              title: doc.metadata?.title || `Source ${index + 1}`,
            });
          });

          // Format documents for the LLM context
          const context = formatDocumentsAsString(docs);

          // Stream the text response
          const result = streamText({
            model: openai("gpt-4.1-nano"),
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              ...messages.slice(0, -1),
              {
                role: "user",
                content: QA_TEMPLATE(context, question),
              },
            ],

            onFinish: async () => {
              // Save the assistant message
              const chatMessage = await prisma.chatMessage.create({
                data: {
                  content: await result.text,
                  role: "assistant",
                  chatHistoryId: chatHistory!.id,
                },
              });

              await prisma.chatSources.createMany({
                data: docs.map((doc, index) => ({
                  title: doc.metadata?.title || `Source ${index + 1}`,
                  content: doc.pageContent,
                  chatMessagesId: chatMessage.id,
                })),
              });

              // Send additional metadata
              dataStream.writeData({
                sourceCount: docs.length,
                query: question,
                chatHistoryId: chatHistory!.id,
              });
            },
          });

          // Merge the text stream into the data stream
          result.mergeIntoDataStream(dataStream);
        },
        onError: (error) => {
          logger.error(error);
          return error instanceof Error ? error.message : String(error);
        },
      });
    } catch (error) {
      logger.error(error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  });
