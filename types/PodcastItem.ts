export type PodcastCategoryType = {
  [key: string]: string;
};

export type PodcastItemType = {
  podcastGuid: string;
  image: string;
  author: string;
  link: string;
  title: string;
  categories: PodcastCategoryType;
  episodeCount: number;
};
