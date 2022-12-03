import { NextApiRequest, NextApiResponse } from "next";
import { getQueryData } from "server/infrastructure/application/helpers";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import { RenderElementMethod, Response } from "share/domain/interfaces";
import { LayoutElement, TextElement } from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";

async function ShowSearchSkill(req: NextApiRequest, res: NextApiResponse) {
  const query = getQueryData(req, "query");

  const pageLayout = LayoutElement.builder()
    .elements([
      TextElement.builder().message(`You search for: ${query}`).build(),
    ])
    .build();

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
