import { NextApiRequest, NextApiResponse } from "next";

import { ROOT_ID } from "../../../../share/domain/engine";
import { encode } from "../../../../share/domain/engine/serializers";
import {
  RenderElementMethod,
  Response,
} from "../../../../share/domain/interfaces";
import {
  ImageElement,
  LayoutElement,
} from "../../../../share/elements/components/widgets";
import { DefaultTemplate } from "../../../../share/elements/templateComponents/templates";
import { getQueryData } from "../../../../server/infrastructure/application/helpers";

async function ShowSearchSkill(req: NextApiRequest, res: NextApiResponse) {
  console.log(getQueryData(req, "query"));

  const imageLayout = LayoutElement.builder()
    .elements([
      ImageElement.builder().src("https://picsum.photos/200/300").build(),
    ])
    .build();

  const pageLayout = LayoutElement.builder().elements([imageLayout]).build();

  const template = DefaultTemplate.builder()
    .id(ROOT_ID)
    .widgets([pageLayout])
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
      await ShowSearchSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
