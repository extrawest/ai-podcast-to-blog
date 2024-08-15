import fs from "fs";
import axios from "axios";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

export class DownloadRunnable extends Runnable<any, any, RunnableConfig> {
  async invoke(input: any): Promise<any> {
    try {
      const response = await axios({
        method: "GET",
        url: input.url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream("./tmp/temp-audio.mp3");
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () =>
          resolve({ audioPath: "./tmp/temp-audio.mp3" })
        );
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
