import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Please provide text" },
        { status: 400 }
      );
    }

    // const response = await hf.inference({
    //   inputs: text,
    //   parameters: {
    //     model_name: "Helsinki-NLP/opus-mt-en-fr",
    //   },
    // });
    // return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
};
