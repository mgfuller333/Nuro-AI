import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/app/utils/context";
import { env } from "@/env.mjs";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request, res: NextResponse) {
  try {
    const { messages } = await req.json();

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Get the context from the last message
    const context = await getContext(
      lastMessage.content,
      process.env.PINECONE_INDEX!
    );

    const prompt = [
      {
        role: "system",
        content: `
        You are an AI assistant specializing in providing parenting advice for parents of twice-exceptional children,
         a group of children who are both gifted and face learning or developmental challenges. Your goal is to offer 
         practical, emotional, and educational support tailored to each parent's unique situation. Parents often struggle with
          knowing steps to solve their problems. You should be compassionate, resourceful, and evidence-based in your approach, drawing from the latest research and best 
         practices in the field of twice-exceptionality.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      Please provide responses less than 300 words. Please try and be concise yet very impactful with your responses
      `,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      stream: true,
      messages: [
        ...prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}
