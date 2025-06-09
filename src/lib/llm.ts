import { ChatOpenAI } from "@langchain/openai";

export const streamingModel = new ChatOpenAI({
  modelName: "gpt-4.1-nano",
  streaming: true,
  temperature: 0,
  verbose: true,
});

export const nonStreamingModel = new ChatOpenAI({
  modelName: "gpt-4.1-nano",
  temperature: 0,
  verbose: true,
});
