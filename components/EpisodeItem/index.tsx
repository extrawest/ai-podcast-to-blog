import { FC, useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

import { Question } from "./Question";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "@/components/ui/switch"
import { PlayCircle, Loader } from "lucide-react";
import { EpisodeItemType, SpeechToTextResponseType, Question as QuestionType } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";

export const EpisodeItem: FC<EpisodeItemType> = ({ enclosureUrl, title, datePublishedPretty, image }) => {

  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [chatVisibility, setChatVisibility] = useState<boolean>(false);
  const [generatedImage, setImageGeneratedImage] = useState<string>("");
  const [translateToFrench, setTranslateToFrench] = useState<boolean>(false);

  const handleImageGeneration = async (context: string) => {
    try {
      setImageLoading(true);
      const imageResponse = await axios.post("/api/text-to-image/generate", { context }, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(imageResponse.data);
      setImageGeneratedImage(url);
    } catch (error) {
      console.log(error);
      setError("Something went wrong, please try again later");
    } finally {
      setImageLoading(false);
    }
  };

  const getEpisodeContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post<SpeechToTextResponseType>("/api/speech-to-text/generate",
        { fileUrl: enclosureUrl, translateToFr: translateToFrench });
      const { data } = response.data;
      data.text && setText(data.text);
      data.originalText && setContext(data.originalText);
      handleImageGeneration(data.originalText);
    } catch (error) {
      console.log(error);
      setError("Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const getEpisodeSummarySpeech = async () => {
    try {
      setSpeechLoading(true);
      const response = await axios.post("/api/text-to-speech/generate", { text }, {
        responseType: "blob",
      });
      const audioObject = URL.createObjectURL(new Blob([response.data]));
      setAudio(audioObject);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Something went wrong, please try again later");
    } finally {
      setSpeechLoading(false);
    }
  };

  const handleQuestionsButton = () => {
    setChatVisibility(!chatVisibility);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, question: "" }]);
  };

  const handleQuestionChange = (question: QuestionType) => {
    const index = questions.findIndex((q) => q.id === question.id);
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  }

  const handleTranslation = async (value: boolean) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/translate", { text, translateToFr: value });
      const { data } = response.data;
      setText(data.text);
      setTranslateToFrench(value);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <Card className="flex-grow w-4/6">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg">{title}</h4>
                <p className="text-xs">
                  {datePublishedPretty}
                </p>
              </div>

              <div className="flex flex-row items-center gap-2">
                {
                  text &&
                  <Button
                    onClick={handleQuestionsButton}
                  >
                    {
                      chatVisibility ? "Hide" : "Have any questions?"
                    }
                  </Button>
                }
                {
                  !text && (
                    <>
                      <p className="text-sm">En</p>
                      <Switch disabled={loading} name="French" checked={translateToFrench} onCheckedChange={setTranslateToFrench} />
                      <p className="text-sm">Fr</p>
                    </>
                  )
                }
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex flex-row justify-start gap-2 items-start">
              {image && <img className="w-32 rounded-lg" src={image} alt={title} />}
              <div className="flex items-center gap-2">
                <Button onClick={getEpisodeContent}>Get summary</Button>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            error && (
              <p className="text-red-400">{error}</p>
            )
          }
          {
            loading ? (
              <div className="flex flex-col space-y-3 mt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ) : text && (
              <>
                <div className="flex flex-row items-start gap-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-row gap-2">
                        <h4 className="text-2xl font-bold mb-2">Episode summary</h4>
                        <Button
                          disabled={speechLoading}
                          onClick={getEpisodeSummarySpeech}
                        >
                          {
                            speechLoading ? <Loader /> : <PlayCircle />
                          }
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="text-sm">En</p>
                        <Switch disabled={loading} name="French" checked={translateToFrench} onCheckedChange={handleTranslation} />
                        <p className="text-sm">Fr</p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="w-3/4">
                        {
                          imageLoading ? (
                            <Skeleton className="h-40 w-full" />
                          ) : generatedImage && (
                            <img className="rounded-lg mt-2" src={generatedImage} alt="Fetched from API" />
                          )
                        }
                      </div>
                      <div className="w-2/4">
                        <p className="mt-2">{text}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {
                    audio && (
                      <div className="mt-4">
                        <h4 className="text-2xl font-bold mb-2">Listen to the summary</h4>
                        <ReactPlayer
                          url={audio}
                          controls
                          width="100%"
                          height="50px"
                        />
                      </div>
                    )
                  }
                </div>
              </>
            )
          }
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
      {
        chatVisibility && (
          <Card className="w-2/6">
            <CardHeader>
              <CardTitle>
                <h4 className="text-lg">Questions</h4>
              </CardTitle>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {
                    questions.map((singleQuestion) => (
                      <Question
                        question={singleQuestion.question}
                        id={singleQuestion.id}
                        key={singleQuestion.id}
                        answer={singleQuestion.answer}
                        context={context}
                        onQuestionSubmit={handleQuestionChange}
                      />
                    ))
                  }
                  {
                    questions.every((q) => q.answer?.length) && (
                      <Button onClick={addQuestion}>Ask question</Button>
                    )
                  }
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        )
      }

    </div>
  )
};