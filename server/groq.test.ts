import { describe, expect, it } from "vitest";
import { completeGroqChat, getGroqClient } from "./groq";

describe("Groq API Integration", () => {
  it("should initialize Groq client with API key", () => {
    const client = getGroqClient();
    expect(client).toBeDefined();
  });

  it("should complete a simple chat request", async () => {
    const response = await completeGroqChat([
      {
        role: "user",
        content: "Say 'test successful' and nothing else.",
      },
    ], {
      maxTokens: 50,
      temperature: 0,
    });

    expect(response).toBeDefined();
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  }, 30000);
});
