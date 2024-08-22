"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeItem } from "@/components/EpisodeItem";
import { PodcastItem } from "@/components/PodcastItem";
import { EpisodeItemType, PodcastItemType } from "@/types";

const PodcastPage = ({ params }: { params: { podcastid: string } }) => {
  const [podcast, setPodcast] = useState<PodcastItemType | null>(null);
  const [episodeList, setEpisodeList] = useState<Array<EpisodeItemType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getPodcastInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post<{ success: boolean, message: string, error?: boolean, data: PodcastItemType }>("/api/podcast/by-guid", { guid: params.podcastid });
      setPodcast(response.data.data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const getEpisodes = async () => {
    try {
      setLoading(true);
      const response = await axios.post<{ success: boolean, message: string, error?: boolean, data: Array<EpisodeItemType> }>("/api/episode/list/by-podcast-guid", {
        guid: params.podcastid
      });
      console.log(response.data);
      setEpisodeList(response.data.data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.podcastid)
      getPodcastInfo();
  }, []);

  useEffect(() => {
    if (podcast)
      getEpisodes();
  }, [podcast]);

  return (
    <div className="w-4/6">
      {
        loading ? (
          <div className="flex flex-col space-y-3 mt-4">
            <Skeleton className="h-[150px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ) : (
          <div>
            {/* podcast */}
            <div>
              {podcast && <PodcastItem {...podcast} />}
            </div>
            <h2 className="text-3xl mt-8">Episodes</h2>
            {/* episodes */}
            <div className="flex gap-3 flex-col mt-4">
              {
                episodeList && episodeList.map((episode, index) => (
                  <EpisodeItem key={index} {...episode} />
                ))
              }
            </div>

          </div>
        )
      }
    </div>
  );
}

export default PodcastPage;