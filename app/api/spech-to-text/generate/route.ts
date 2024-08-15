import { NextResponse } from "next/server";

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

    return NextResponse.json({
      message: "Success",
      success: true,
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
