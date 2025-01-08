import { API_URL, BEARER_TOKEN } from "@/lib/serverConstants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chatType: string = body.chatType;
    const chatCompletionRequest = body.chatCompletionRequest;

    if (!chatType || !chatCompletionRequest) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/api/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatCompletionRequest),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line.includes("[DONE]")) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            continue;
          }

          const jsonString = line.replace(/^data: /, "").trim();
          if (!jsonString) continue;

          try {
            JSON.parse(jsonString); // Validate JSON
            controller.enqueue(encoder.encode(`data: ${jsonString}\n\n`));
          } catch (e) {
            console.warn("Invalid JSON chunk:", jsonString);
          }
        }
      },
    });

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    return NextResponse.json(
      { error: "Failed to process chat completion" },
      { status: 500 }
    );
  }
}
