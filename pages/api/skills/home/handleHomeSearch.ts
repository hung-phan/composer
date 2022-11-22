import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "../../../../share/domain/engine/serializers";
import {
  HttpMethodRequestBody,
  NavigateMethod,
  Response,
} from "../../../../share/domain/interfaces";
import { InputElementState } from "../../../../share/elements/components/widgets";

async function HandleHomeSearchSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { elementState }: HttpMethodRequestBody<any, InputElementState, any> =
    req.body;

  res.status(200).send(
    encode(
      Response.builder()
        .methods([NavigateMethod.builder().url(`/search=${elementState.data}`).build()])
        .build()
    )
  );
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
