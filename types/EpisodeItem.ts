export type EpisodeItemType = {
  enclosureUrl: string;
  link: string;
  title: string;
  description: string;
  datePublishedPretty: string;
  image: string;
  feedLanguage: string;
};

export type SpeechToTextType = {
  text: string;
  originalText: string;
};

export type SpeechToTextResponseType = {
  success: boolean;
  message: string;
  error?: boolean;
  data: SpeechToTextType;
};

export type Question = {
  id: number;
  question: string;
  answer?: string;
};

export type QuestionProps = Question & {
  context: string;
  onQuestionSubmit: (question: Question) => void;
};

export type Answer = string;

export type AnswerResponse = {
  message: string;
  success: boolean;
  data: {
    text: Answer;
  };
  error?: any;
};
