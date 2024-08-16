export type TextToSpechTypes = {
  url: string;
};

export type TextToSpechResultType = {
  text: string;
};

export type TextToSpechResultExpandedType = TextToSpechResultType & {
  originalText: string;
};
