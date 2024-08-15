import { NextResponse } from "next/server";

import { podcastIndexClient } from "@/podcast-index";

export const POST = async (req: Request) => {
  try {
    const { guid } = await req.json();
    if (!guid) {
      return NextResponse.json(
        {
          message: "Guid is required",
          success: false,
        },
        { status: 400 }
      );
    }
    const response = await podcastIndexClient.getPodcastByGUID(guid);

    return NextResponse.json({
      message: "Success",
      success: true,
      data: response.data.feed,
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
