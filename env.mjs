import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
  
    PINECONE_API_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    PINECONE_INDEX: z.string().min(1),
    PINECONE_CLOUD: z.string().min(1),
    PINECONE_REGION: z.string().min(1),
    PINECONE_NAMESPACE: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    PINECONE_CLOUD: process.env.PINECONE_CLOUD,
    PINECONE_REGION: process.env.PINECONE_REGION,
  },
})
