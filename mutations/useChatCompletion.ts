import { useMutation } from "@tanstack/react-query";

export type ChatType = "trader" | "professor" | "planner" | "self-help";

export type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant" | "function";
  content: string;
};

type ChatCompletionRequest = {
  messages: ChatCompletionRequestMessage[];
  stream: boolean;
  model: string;
  temperature?: number;
};

export function useChatMutation() {
  return useMutation({
    mutationFn: async ({
      chatType,
      chatCompletionRequest,
      onProgress,
    }: {
      chatType: ChatType;
      chatCompletionRequest: ChatCompletionRequest;
      onProgress: (content: string) => void;
    }) => {
      const response = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatType,
          chatCompletionRequest,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line.includes("[DONE]")) continue;

          const jsonString = line.replace(/^data: /, "").trim();
          if (!jsonString) continue;

          try {
            const json = JSON.parse(jsonString);
            const delta = json.choices[0]?.delta?.content || "";
            content += delta;

            onProgress(content);
          } catch (e) {
            console.warn("Failed to parse chunk:", jsonString);
          }
        }
      }

      return content;
    },
  });
}
