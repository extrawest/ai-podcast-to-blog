import { vertexAI } from "@/vertex";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechResultExpandedType } from "./types";

const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export class TranslateRunnable extends Runnable<
  TextToSpechResultExpandedType,
  TextToSpechResultExpandedType,
  RunnableConfig
> {
  async invoke(
    input: TextToSpechResultExpandedType,
    options: RunnableConfig
  ): Promise<TextToSpechResultExpandedType> {
    try {
      if (options?.configurable?.translateToFr) {
        const prompt = `Translate this: "${input.text.toLowerCase()}" to the ${
          options?.configurable?.translateToFr ? "french" : "english"
        }`;
        const systemInstruction =
          "You are a helpful assistant. You should translate the text to the language specified by the user. Only return the translation, no need to repeat the text.";
        const response = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction,
        });
        const responseText =
          response?.response?.candidates?.[0].content.parts[0].text;
        return {
          text: responseText || "",
          originalText: input.originalText,
        };
      }
      return input;
    } catch (error) {
      console.error("Error", error);
      throw new Error("Something went wrong");
    }
  }

  get lc_namespace(): string[] {
    return ["HuggingFaceRunnable"];
  }
}

export const translateRunnable = new TranslateRunnable();
