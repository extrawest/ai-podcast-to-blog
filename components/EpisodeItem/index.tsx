import { FC, useState } from "react";
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
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [chatVisibility, setChatVisibility] = useState<boolean>(false);
  const [translateToFrench, setTranslateToFrench] = useState<boolean>(false);

  const getEpisodeContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post<SpeechToTextResponseType>("/api/speech-to-text/generate",
        { fileUrl: enclosureUrl, translateToFr: translateToFrench });
      const { data } = response.data;
      data.text && setText(data.text);
      data.originalText && setContext(data.originalText);
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

  const handleTranslation = () => {

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
                  <div className={`${audio?.length ? "w-3/6" : "w-full"}`}>
                    <h4 className="text-2xl font-bold mb-2">Episode summary</h4>
                    <p>{text}</p>
                  </div>
                  <div className={`${audio?.length ? "w-3/6" : "w-1/12"}`}>
                    {
                      text && (
                        <Button
                          disabled={speechLoading}
                          onClick={getEpisodeSummarySpeech}
                        >
                          {
                            speechLoading ? <Loader /> : <PlayCircle />
                          }
                        </Button>
                      )
                    }
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