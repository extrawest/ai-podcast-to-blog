import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechResultType, TextToSpechResultExpandedType } from "./types";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

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
      const response = await hf.summarization(
        {
          inputs: input.text,
        },
        {
          wait_for_model: true,
        }
      );
      console.log("Data summarize", response);
      return {
        text: response.summary_text,
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
