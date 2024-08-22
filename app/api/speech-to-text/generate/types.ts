export type TextToSpechTypes = {
  url: string;
};

export type AudioFileResponseType = {
  audioFile: Buffer;
};

export type TextToSpechResultType = {
  text: string;
};

export type TextToSpechResultExpandedType = TextToSpechResultType & {
  originalText: string;
};
