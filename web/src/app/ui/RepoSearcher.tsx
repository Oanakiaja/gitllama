"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { atom, useAtom, useSetAtom } from "jotai";
import { ChangeEvent } from "react";
import { streaming_qa } from "@/app/actions/client/agent";
import { abortSignal, type FetchOptions } from "@/app/actions/client/fetch";
import { ContentAtom } from "./Chat";
import { useState } from "react";
// import { qa } from "../actions/server/agent";

const QAAtom = atom("");

const PlaceHolder = "Agent System Overview";

export const useStreamingQA = () => {
  const [loading, setLoading] = useState(false);
  const setContent = useSetAtom(ContentAtom);
  const appendStreamingResp = (message: string) => {
    setContent((prevContent) => (prevContent ?? "") + message);
  };
  const streamingQA = async (params: { session: string; question: string }) => {
    setContent("")
    await streaming_qa(params, {
      setLoading,
      appendStreamingResp
    });
  };

  const abortFetch = () => {
    abortSignal()
    setLoading(false);
  };

  return [loading, streamingQA, abortFetch] as const;
};

export function RepoSearcher() {
  const [qa, setQA] = useAtom(QAAtom);
  const [loading, streamingQA, abortFetch] = useStreamingQA();

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQA(event.target.value);
  };

  const handleSubmit = async () => {
    const str = (str: string) => {
      if (!qa) return PlaceHolder;
      return str.trim();
    };
    streamingQA({ session: "mock", question: str(qa) });
  };

  return (
    <div className="flex w-full max-w-md items-center space-x-2">
      <Input type="url" placeholder={PlaceHolder} onChange={handleInput} />
      <Button type="submit" onClick={handleSubmit} loading={loading}>
        Ask!
      </Button>
      {loading && <Button onClick={abortFetch}>Cancel</Button>}
    </div>
  );
}
