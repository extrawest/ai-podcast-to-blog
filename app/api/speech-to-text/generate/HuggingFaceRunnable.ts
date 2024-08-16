import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechTypes, TextToSpechResultType } from "./types";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export class HuggingFaceRunnable extends Runnable<
  TextToSpechTypes,
  TextToSpechResultType,
  RunnableConfig
> {
  async invoke(input: TextToSpechTypes): Promise<TextToSpechResultType> {
    try {
      const { url } = input;
      if (!url) {
        throw new Error("Audio path is required");
      }
      const audioBuffer = fs.readFileSync(url);
      const data = await hf.automaticSpeechRecognition(
        {
          model: "facebook/wav2vec2-base-960h",
          data: audioBuffer,
        },
        {
          wait_for_model: true,
        }
      );
      fs.unlinkSync("./tmp/temp-audio.mp3");
      return data;
    } catch (error) {
      console.error("Error", error);
      throw new Error("Something went wrong while converting audio to text");
    }
  }

  get lc_namespace(): string[] {
    return ["HuggingFaceRunnable"];
  }
}

export const huggingFaceRunnable = new HuggingFaceRunnable();
