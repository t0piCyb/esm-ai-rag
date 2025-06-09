import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { logger } from "./logger";
export async function getChunkedDocsFromText(file: File) {
  try {
    const loader = new TextLoader(file);
    const docs = await loader.load();
    docs.forEach((doc, index) => {
      doc.metadata = {
        title: file.name || `Source ${index + 1}`,
      };
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs;
  } catch (error) {
    logger.error(`Error loading Text: ${error}`);
    throw error;
  }
}
