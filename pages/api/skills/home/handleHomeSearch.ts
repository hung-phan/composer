import { NextApiRequest, NextApiResponse } from "next";

import { SearchFormInput } from "./showHome";

async function HandleHomeSearchSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: SearchFormInput = req.body;

  res.redirect(`/search?query=${encodeURIComponent(data.search)}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await HandleHomeSearchSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
