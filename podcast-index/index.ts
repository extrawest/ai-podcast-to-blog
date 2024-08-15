import CryptoJS from "crypto-js";
import axios, { AxiosInstance } from "axios";

const getApiHeaderTime = () => new Date().getTime() / 1000;
const getHash = ({
  authKey,
  secretKey,
}: {
  authKey: string;
  secretKey: string;
}) =>
  CryptoJS.SHA1(authKey + secretKey + getApiHeaderTime()).toString(
    CryptoJS.enc.Hex
  );

class PodcastIndexCustomClient {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string = "https://api.podcastindex.org/api/1.0";

  private axiosClient: AxiosInstance;

  constructor() {
    this.apiKey = process.env.PODCAST_API_KEY || "";
    this.secretKey = process.env.PODCAST_SECRET_KEY || "";

    const headers = {
      "X-Auth-Key": this.apiKey,
      "Content-Type": "application/json",
      "User-Agent": "SuperPodcastPlayer/1.8",
      "X-Auth-Date": "" + getApiHeaderTime(),
      Authorization: getHash({
        authKey: this.apiKey,
        secretKey: this.secretKey,
      }),
    };

    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      headers,
    });
  }

  searchPodcastsByTitle(query: string) {
    return this.axiosClient.get(`/search/bytitle?q=${query}&pretty`);
  }

  getPodcastByGUID(guid: string) {
    return this.axiosClient.get(
      `/podcasts/byguid?guid=${guid}&pretty&fulltext`
    );
  }

  getEpisodesByPodcastGUID(guid: string) {
    return this.axiosClient.get(
      `/episodes/bypodcastguid?guid=${guid}&fulltext`
    );
  }
}

export const podcastIndexClient = new PodcastIndexCustomClient();
