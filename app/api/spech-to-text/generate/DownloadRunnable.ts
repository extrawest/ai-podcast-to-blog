import fs from "fs";
import axios from "axios";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechTypes } from "./types";

export class DownloadRunnable extends Runnable<
  TextToSpechTypes,
  TextToSpechTypes,
  RunnableConfig
> {
  async invoke(input: { url: string }): Promise<TextToSpechTypes> {
    try {
      const response = await axios({
        method: "GET",
        url: input.url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream("./tmp/temp-audio.mp3");
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve({ url: "./tmp/temp-audio.mp3" }));
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error", error);
      throw new Error("Something went wrong");
    }
  }

  get lc_namespace(): string[] {
    return ["HuggingFaceRunnable"];
  }
}

export const downloadRunnable = new DownloadRunnable();
