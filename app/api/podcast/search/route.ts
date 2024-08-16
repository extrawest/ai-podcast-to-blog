import { NextResponse } from "next/server";

import { podcastIndexClient } from "@/podcast-index";

import { PodcastItemType } from "@/types";

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
    const response = await podcastIndexClient.getPodcastsByTitle(query);

    const uniqueFeeds: PodcastItemType[] = response.data.feeds.filter(
      (feed: PodcastItemType, index: number, self: PodcastItemType[]) => {
        return (
          self.findIndex(
            (f: PodcastItemType) => f.podcastGuid === feed.podcastGuid
          ) === index
        );
      }
    );
    const filteredFeeds = uniqueFeeds.filter((feed: PodcastItemType) => {
      return feed.episodeCount >= 1;
    });

    return NextResponse.json({
      message: "Success",
      success: true,
      data: filteredFeeds,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
        error: true,
      },
      { status: 500 }
    );
  }
};
