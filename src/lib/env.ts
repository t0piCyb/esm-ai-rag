import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_CLOUD: z.string().min(1),
    PINECONE_REGION: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
