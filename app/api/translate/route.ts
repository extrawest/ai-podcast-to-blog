import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export const POST = async (req: Request) => {
  try {
    const { text, translateToFr } = await req.json();
    if (!text || (translateToFr !== true && translateToFr !== false)) {
      return NextResponse.json(
        {
          message: "Text and language are required",
          success: false,
        },
        { status: 400 }
      );
    }
    const parameters = {
      src_lang: translateToFr ? "en_XX" : "fr_XX",
      tgt_lang: translateToFr ? "fr_XX" : "en_XX",
    };
    const response = await hf.translation(
      {
        model: "facebook/mbart-large-50-many-to-many-mmt",
        inputs: text,
        // @ts-ignore: Poor typing in the library
        parameters,
      },
      {
        wait_for_model: true,
      }
    );
    return NextResponse.json(
      {
        data: {
          text: Array.isArray(response)
            ? response[0].translation_text
            : response.translation_text,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
};
