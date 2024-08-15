import { NextResponse } from "next/server";

import { podcastIndexClient } from "@/podcast-index";

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json(
        {
          message: "Query is required",
          success: false,
        },
        { status: 400 }
      );
    }
    const response = await podcastIndexClient.searchPodcastsByTitle(query);

    return NextResponse.json({
      message: "Success",
      success: true,
      data: response.data.feeds,
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
