import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export const POST = async (req: Request) => {
  try {
    const { question, context } = await req.json();
    if (!question || !context) {
      return NextResponse.json(
        {
          message: "Question and context are required",
          success: false,
        },
        { status: 400 }
      );
    }
    const response = await hf.questionAnswering(
      {
        // model: "HuggingFaceH4/zephyr-7b-beta",
        inputs: {
          question: question,
          context: context,
        },
      },
      {
        wait_for_model: true,
      }
    );
    const { answer } = response;
    return NextResponse.json({
      message: "Success",
      success: true,
      data: {
        answer,
      },
    });
  } catch (e) {
    console.error(e);
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
