import { NextResponse } from "next/server";

import { downloadRunnable } from "./DownloadRunnable";
import { translateRunnable } from "./TranslateRunnable";
import { huggingFaceRunnable } from "./HuggingFaceRunnable";
import { summarizationRunnable } from "./SummarizeRunnable";
export const POST = async (req: Request) => {
  try {
    const { fileUrl, translateTo = "fr_FR" } = await req.json();
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
      .pipe(huggingFaceRunnable)
      .pipe(summarizationRunnable)
      .pipe(translateRunnable)
      .invoke(
        { url: fileUrl },
        {
          configurable: {
            translateTo,
          },
        }
      );

    return NextResponse.json({
      message: "Success",
      success: true,
      data: {
        text: response.text,
        originalText: response.originalText,
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
