"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";

import { PodcastItemType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PodcastItem } from "@/components/PodcastItem";
import { PodcastSearch } from "@/components/PodcastSearch";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [podcasts, setPodcasts] = useState<Array<PodcastItemType>>([]);
  const [selectedPodcastID, setSelectedPodcastID] = useState<string | null>(null);
  const [value] = useDebounce(search, 1000);

  const getPodcasts = async () => {
    try {
      setLoading(true);
      const response = await axios.post<{ success: boolean, message: string, error?: boolean, data: Array<PodcastItemType> }>("/api/podcast/search", {
        query: value
      });
      console.log(response);
      setPodcasts(response.data.data);
    } catch (e) {
      setError("Something went wrong, please try again later");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (value)
      getPodcasts();
  }, [value]);

  const handleOnPodcastSelect = (podcastGuid: string) => {
    setSelectedPodcastID(podcastGuid);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col w-9/12">
        <PodcastSearch
          search={search}
          disabled={loading}
          onSearchChange={setSearch}
        />
        {
          loading ? (
            <div className="flex flex-col space-y-3 mt-4">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              {
                podcasts.map((podcast) => (
                  <PodcastItem key={podcast.podcastGuid} {...podcast} onPodcastSelect={handleOnPodcastSelect} />
                ))
              }
            </div>
          )
        }
      </div>
    </main>
  );
}
