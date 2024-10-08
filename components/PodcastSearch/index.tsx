import { FC } from "react";
import { Input } from "@/components/ui/input";

import { PodcastSearchProps } from "./types";

export const PodcastSearch: FC<PodcastSearchProps> = ({
  onSearchChange,
  disabled,
  search,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }
  return (
    <div>
      <h1>Podcast Search</h1>
      <Input value={search} disabled={disabled} onChange={handleSearchChange} />
    </div>
  );
}