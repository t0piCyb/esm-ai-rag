export const STANDALONE_QUESTION_TEMPLATE = ` Given the following conversation and a follow up question, answer the question.

Chat History:
{{chat_history}}

Follow up question:
{{question}}

Standaline question:`;

export const QA_TEMPLATE = (
  context: string,
  question: string,
) => `You are an enthusiastic, helpful, theologian, specialist about new evangelization AI assistant .
Use the following pieces of retrieved context to answer the question.
Translate the question in english if it is not in english and answer in the same language as the question.

Context:
${context}

Question:
${question}

Helpful answer in markdown format:
`;
