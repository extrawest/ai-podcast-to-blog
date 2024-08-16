"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";

import { PodcastSearch } from "@/components/PodcastSearch";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);

  useEffect(() => {
    console.log(value);
    if (value)
      getPodcasts();
  }, [value]);

  const getPodcasts = async () => {
    const response = await axios.post("/api/podcast/search", {
      query: value
    });
    console.log(response);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col w-9/12">
        {value}
        <PodcastSearch
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  );
}
