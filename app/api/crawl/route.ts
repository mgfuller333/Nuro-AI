import seed from "./seed";
import { NextResponse } from "next/server";
import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { env } from "@/env.mjs";

export const runtime = "edge";

export async function POST(req: Request) {
  const { url, options } = await req.json();
  try {
    const documents = await seed(
      url,
      1,
      env.PINECONE_INDEX!,
      (env.PINECONE_CLOUD as ServerlessSpecCloudEnum) || "aws",
      env.PINECONE_REGION || "us-east-1",
      options
    );
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed crawling" });
  }
}
