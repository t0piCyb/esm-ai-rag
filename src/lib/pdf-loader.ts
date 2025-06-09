import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { logger } from "./logger";

export async function getChunkedDocsFromPDF(filePath: string) {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs;
  } catch (error) {
    logger.error(`Error loading PDF: ${error}`);
    throw error;
  }
}
