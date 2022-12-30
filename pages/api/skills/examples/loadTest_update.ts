import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "share/domain/engine/serializers";
import { BatchRenderElementMethod, Response } from "share/domain/interfaces";
import { Text } from "share/elements/components/widgets";

async function LoadTestSkill(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    encode(
      Response.builder()
        .methods([
          BatchRenderElementMethod.builder()
            .elements(
              _.range(0, 500).map((val) =>
                Text.builder()
                  .id(`TEXT_${val}`)
                  .message(`This is text element with ${Math.random()}`)
                  .build()
              )
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
    case "GET":
      await LoadTestSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
