import { ChangeEvent, FC, useState } from "react";
import axios from "axios";

import { Input } from "../ui/input";
import { AnswerResponse, QuestionProps } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const Question: FC<QuestionProps> = ({
  id,
  answer,
  context,
  question,
  onQuestionSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>("");

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  const hanldeQuestionSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post<AnswerResponse>("/api/question/generate", {
        question: questionText,
        context,
      });
      onQuestionSubmit({ id, question: questionText, answer: response.data.data.text });
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-1 w-full">
        {
          loading &&
          <div className="flex flex-col space-y-3 my-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        }
        {
          answer ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <h5 className="text-sm">{question}</h5>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-500 py-4 rounded-sm">
                <div>{answer}</div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={hanldeQuestionSubmit}>
              <div className="flex flex-row gap-4">
                <Input value={questionText} onChange={handleQuestionChange} disabled={loading} />
                <Button type="submit" disabled={loading || !questionText}>Submit</Button>
              </div>
            </form>
          )
        }
      </div>
    </div>
  )
}