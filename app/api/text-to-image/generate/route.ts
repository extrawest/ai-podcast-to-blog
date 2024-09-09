import { vertexAI } from "@/vertex";
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const huggingfaceToken = process.env.HUGGING_FACE_TOKEN;

const hf = new HfInference(huggingfaceToken);

const textModel = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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
    Return only the prompt, do not repeat the context.
    `;

    const textResponse = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: textPrompt }],
        },
      ],
    });
    const text = textResponse?.response?.candidates?.[0].content.parts[0].text;

    const prompt = `Generate me a image which represents the following prompt: ${text}`;

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
