import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import { ROOT_ID } from "../../../../share/domain/engine";
import { encode } from "../../../../share/domain/engine/serializers";
import {
  HttpMethod,
  RenderElementMethod,
  Response,
} from "../../../../share/domain/interfaces";
import {
  LayoutElement,
  TextElement,
} from "../../../../share/elements/components/widgets";
import { PeriodicTemplate } from "../../../../share/elements/templateComponents/templates";

async function LoadTestSkill(_req: NextApiRequest, res: NextApiResponse) {
  const pageLayout = LayoutElement.builder()
    .elements(
      _.range(0, 500).map((val) =>
        TextElement.builder()
          .id(`TEXT_${val}`)
          .message(`This is text element with ${Math.random()}`)
          .build()
      )
    )
    .build();

  const template = PeriodicTemplate.builder()
    .id(ROOT_ID)
    .widgets([pageLayout])
    .intervalInMs(200)
    .methods([
      HttpMethod.builder()
        .url("/api/skills/examples/loadTest_update")
        .requestType("GET")
        .build(),
    ])
    .build();

  res.status(200).send(
    encode(
      Response.builder()
        .methods([RenderElementMethod.builder().element(template).build()])
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
