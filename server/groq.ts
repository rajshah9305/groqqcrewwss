import Groq from "groq-sdk";
import { ENV } from "./_core/env";

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    if (!ENV.groqApiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }
    groqClient = new Groq({
      apiKey: ENV.groqApiKey,
    });
  }
  return groqClient;
}

export interface StreamingMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function* streamGroqCompletion(
  messages: StreamingMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): AsyncGenerator<string, void, unknown> {
  const client = getGroqClient();
  
  const stream = await client.chat.completions.create({
    model: options?.model || "llama-3.3-70b-versatile",
    messages: messages,
    temperature: options?.temperature !== undefined ? options.temperature / 100 : 1,
    max_completion_tokens: options?.maxTokens || 8192,
    top_p: 1,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

export async function completeGroqChat(
  messages: StreamingMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const client = getGroqClient();
  
  const completion = await client.chat.completions.create({
    model: options?.model || "llama-3.3-70b-versatile",
    messages: messages,
    temperature: options?.temperature !== undefined ? options.temperature / 100 : 1,
    max_completion_tokens: options?.maxTokens || 8192,
    top_p: 1,
    stream: false,
  });

  return completion.choices[0]?.message?.content || "";
}
