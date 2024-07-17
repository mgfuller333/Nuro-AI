import {
  Pinecone,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { env } from "@/env.mjs";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
  hash: string;
};

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  namespace: string
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  console.log("pinecone index", env.PINECONE_INDEX);

  const indexName: string = env.PINECONE_INDEX || "turavi-chat-multi";
  if (indexName === "") {
    throw new Error("PINECONE_INDEX environment variable not set");
  }

  // Retrieve the list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`);
  }

  // Get the Pinecone index
  const index = pinecone!.Index<Metadata>(indexName);

  // Get the namespace
  const pineconeNamespace = index.namespace(process.env.PINECONE_NAMESPACE!);

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    });

    console.log("Pinecone queryResult", queryResult);
    return queryResult.matches || [];
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { getMatchesFromEmbeddings };
