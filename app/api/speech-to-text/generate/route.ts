import { NextResponse } from "next/server";

import { downloadRunnable } from "./DownloadRunnable";
import { translateRunnable } from "./TranslateRunnable";
import { summarizationRunnable } from "./SummarizeRunnable";
import { speechRecognitionRunnable } from "./SpeechRecognitionRunnable";
export const POST = async (req: Request) => {
  try {
    const { fileUrl, translateToFr = false } = await req.json();
    if (!fileUrl) {
      return NextResponse.json(
        {
          message: "File URL is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const response = await downloadRunnable
      .pipe(speechRecognitionRunnable)
      .pipe(summarizationRunnable)
      .pipe(translateRunnable)
      .invoke(
        { url: fileUrl },
        {
          configurable: {
            translateToFr,
          },
        }
      );

    return NextResponse.json({
      message: "Success",
      success: true,
      data: {
        text: response.text.toLowerCase(),
        originalText: response.originalText.toLowerCase(),
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
        error: e,
      },
      { status: 500 }
    );
  }
};
