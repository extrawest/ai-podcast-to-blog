import fs from "fs";
import axios from "axios";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

import { TextToSpechTypes, AudioFileResponseType } from "./types";

export class DownloadRunnable extends Runnable<
  TextToSpechTypes,
  AudioFileResponseType,
  RunnableConfig
> {
  async invoke(input: { url: string }): Promise<AudioFileResponseType> {
    try {
      const response = await axios({
        method: "GET",
        url: input.url,
        responseType: "stream",
      });
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        response.data.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.data.on("end", () => resolve(Buffer.concat(chunks)));
        response.data.on("error", reject);
      });
      console.log("Buffer", buffer);
      return { audioFile: buffer };
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
