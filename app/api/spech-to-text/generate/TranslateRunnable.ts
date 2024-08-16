import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechResultType, TextToSpechResultExpandedType } from "./types";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

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
      if (options?.configurable?.translateTo) {
        const response = await hf.translation(
          {
            model: "facebook/mbart-large-50-many-to-many-mmt",
            inputs: input.text.toLowerCase(),
            // @ts-ignore: Poor typing in the library
            parameters: {
              src_lang: "en_XX",
              tgt_lang: "fr_XX",
            },
          },
          {
            wait_for_model: true,
          }
        );
        return {
          text: Array.isArray(response)
            ? response[0].translation_text
            : response.translation_text,
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
