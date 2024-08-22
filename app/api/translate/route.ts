import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export const POST = async (req: Request) => {
  try {
    const { text } = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
};
