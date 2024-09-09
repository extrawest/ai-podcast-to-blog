import { vertexAI } from "@/vertex";
import { NextResponse } from "next/server";

const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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
    const prompt = `Translate this: "${text}" to the ${
      translateToFr ? "french" : "english"
    }`;
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction:
        "You are a helpful assistant. You should translate the text to the language specified by the user. Only return the translation, no need to repeat the text.",
    });
    const responseText =
      response?.response?.candidates?.[0].content.parts[0].text;

    return NextResponse.json(
      {
        data: {
          text: responseText,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
};
