import { FC } from 'react';
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

import { PodcastItemType } from "@/types";

type PodcastItemCardType = PodcastItemType & {
  showButton?: boolean;
};

export const PodcastItem: FC<PodcastItemCardType> = ({
  podcastGuid,
  image,
  author,
  link,
  title,
  categories,
  showButton,
  episodeCount,
}) => {
  const router = useRouter();

  const handleOnPodcastSelect = () => {
    router.push(`/podcast/${podcastGuid}`);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              {title}
              {
                showButton &&
                <Button
                  onClick={handleOnPodcastSelect}
                >
                  Select
                </Button>
              }
            </div>
          </CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-6">
            {image && <img className="w-32 rounded-lg" src={image} alt={title} />}
            <div className="flex flex-col gap-2 justify-center">
              {link && <p><b>Website:</b> <a target='_blank' href={link}>{link}</a></p>}
              <div className="flex flex-row gap-4">
                <p><b>Categories:</b></p>
                {
                  Object.values(categories).map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))
                }
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p><b>Episode Count:</b> {episodeCount}</p>
        </CardFooter>
      </Card>
    </div>
  )
}