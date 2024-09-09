import { vertexAI } from "@/vertex";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechResultType, TextToSpechResultExpandedType } from "./types";

const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export class SummarizationRunnable extends Runnable<
  TextToSpechResultType,
  TextToSpechResultExpandedType,
  RunnableConfig
> {
  async invoke(
    input: TextToSpechResultType
  ): Promise<TextToSpechResultExpandedType> {
    try {
      console.log("Summarize input", input);
      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: input.text }],
          },
        ],
        systemInstruction:
          "You are a helpful assistant. You should summarize the text. Only return the summary, no need to repeat the text.",
      });
      console.log("Data summarize", response);
      return {
        text: response.response?.candidates?.[0].content.parts[0].text || "",
        originalText: input.text,
      };
    } catch (error) {
      console.error("Error", error);
      throw new Error("Something went wrong");
    }
  }

  get lc_namespace(): string[] {
    return ["HuggingFaceRunnable"];
  }
}

export const summarizationRunnable = new SummarizationRunnable();
