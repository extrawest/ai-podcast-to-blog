import { NextResponse } from "next/server";

import { vertexAI } from "@/vertex";

const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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

    const prompt = `You are a helpful assistant. You should answer the question based on the provided context. Here is the context:\n\n"${context}"`;
    const userPrompt = `Answer the question: ${question}`;

    const respose = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: prompt,
    });

    const text = respose?.response?.candidates?.[0].content.parts[0].text;

    return NextResponse.json({
      message: "Success",
      success: true,
      data: {
        text,
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
