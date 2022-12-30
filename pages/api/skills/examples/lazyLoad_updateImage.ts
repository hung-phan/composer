import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethodRequestBody,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import { Image } from "share/elements/components/widgets";

async function LazyLoadUpdateImageSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestData }: HttpMethodRequestBody<string, any> = req.body;

  res.status(200).send(
    encode(
      Response.builder()
        .methods([
          RenderElementMethod.builder()
            .element(
              Image.builder()
                .id(requestData.data)
                .src(
                  `https://picsum.photos/400?random=${_.random(0, 1000, false)}`
                )
                .class("w-48")
                .build()
            )
            .build(),
        ])
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
      await LazyLoadUpdateImageSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
