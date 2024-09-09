import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

import {
  TextToSpechTypes,
  TextToSpechResultType,
  AudioFileResponseType,
} from "./types";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export class SpeechRecognitionRunnable extends Runnable<
  AudioFileResponseType,
  TextToSpechResultType,
  RunnableConfig
> {
  async invoke(input: AudioFileResponseType): Promise<TextToSpechResultType> {
    try {
      const { audioFile } = input;
      if (!audioFile) {
        throw new Error("Audio file is required");
      }
      const data = await hf.automaticSpeechRecognition(
        {
          model: "facebook/wav2vec2-base-960h",
          data: audioFile,
        },
        {
          wait_for_model: true,
        }
      );
      console.log("Data", data);
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

export const speechRecognitionRunnable = new SpeechRecognitionRunnable();
