import { NextApiRequest, NextApiResponse } from "next";

async function HandleHomeSearchSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.redirect(`/search=${req.body.search}`);
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
