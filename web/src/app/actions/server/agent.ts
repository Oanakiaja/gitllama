"use server";
const serverActionApi =
  (path: string, method: "GET" | "POST" = "POST") =>
  async <Params extends Record<string, unknown>, Resp = void>(body: Params) => {
    let url = `${process.env.BACKEND_URL}/stream/${path}`;
    if (method === "GET") {
      url += `?${new URLSearchParams(JSON.stringify(body))}`;
    }

    const response = await fetch(url, {
      method,
      body: method === "POST" ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw "[error]: python server!";
    }

    return response.json() as Promise<Resp>;
  };

// qa
type QAAnswer = {
  answer: string;
  context: string;
};

export const qa = (params: {
  session: string;
  question: string;
}): Promise<QAAnswer> => serverActionApi("qa", "POST")(params);


export const loadDoc = (params: {
  repo: string
}):Promise<void> => serverActionApi("load_doc", "POST")(params)