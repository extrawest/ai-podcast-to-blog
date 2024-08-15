import { NextResponse } from "next/server";

import { downloadRunnable } from "./DownloadRunnable";
import { huggingFaceRunnable } from "./HuggingFaceRunnable";

export const POST = async (req: Request) => {
  try {
    const { fileUrl } = await req.json();
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
      .invoke({ url: fileUrl });

    return NextResponse.json({
      message: "Success",
      success: true,
      data: response.text,
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
