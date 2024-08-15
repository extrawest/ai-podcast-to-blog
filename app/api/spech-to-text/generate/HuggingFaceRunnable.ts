import fs from "fs";
import axios from "axios";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

export class HuggingFaceRunnable extends Runnable<any, any, RunnableConfig> {
  async invoke(input: any): Promise<any> {
    try {
      const { audioPath } = input;
      if (!audioPath) {
        throw new Error("Audio path is required");
      }
      const audioBuffer = fs.readFileSync(audioPath);
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
        audioBuffer,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      fs.unlinkSync("./tmp/temp-audio.mp3");
      return result;
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
