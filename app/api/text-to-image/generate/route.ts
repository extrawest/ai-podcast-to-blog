import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

export const POST = async (req: Request) => {
  try {
    const { context } = await req.json();
    if (!context) {
      return NextResponse.json(
        { error: "Please provide context" },
        { status: 400 }
      );
    }

    const textPrompt = `
    Generate me a propmt which will be used as an input to generate image from this text: ${context}
    Return only the prompt, no need to repeat the context.
    `;

    const propmtResponse = await hf.textGeneration(
      {
        inputs: textPrompt,
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      },
      {
        wait_for_model: true,
      }
    );

    const test2 = propmtResponse.generated_text.split("\n");
    const lastElement = test2[test2.length - 1];
    const prompt = `Generate me a image which represents the following prompt: ${lastElement}`;

    const image = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
    });

    const buffer = await image.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": image.type || "image/jpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
};
