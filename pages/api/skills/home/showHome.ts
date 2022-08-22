import { NextApiRequest, NextApiResponse } from "next";

import { ROOT_ID } from "../../../../share/domain/engine";
import { encode } from "../../../../share/domain/engine/serializers";
import {
  RenderElementMethod,
  Response,
  StateHolderElement,
} from "../../../../share/domain/interfaces";
import {
  ButtonElement,
  ImageElement,
  InputElement,
  InputElementState,
  LayoutElement,
} from "../../../../share/elements/components/widgets";
import { DefaultTemplate } from "../../../../share/elements/templateComponents/templates";
import getNewId from "../../../../share/library/idGenerator";

async function ShowHomeSkill(_: NextApiRequest, res: NextApiResponse) {
  const INPUT_BOX_STATE_HOLDER = getNewId();

  const inputElementStateHolder =
    StateHolderElement.builder<InputElementState>()
      .id(INPUT_BOX_STATE_HOLDER)
      .elementState({ data: "" })
      .build();

  const inputElement = InputElement.builder()
    .stateId(INPUT_BOX_STATE_HOLDER)
    .placeholder("Search any community here")
    .build();

  const searchButton = ButtonElement.builder().label("Search").build();

  const inputLayout = LayoutElement.builder()
    .elements([inputElementStateHolder, inputElement, searchButton])
    .build();

  const imageLayout = LayoutElement.builder()
    .elements([
      ImageElement.builder().src("https://picsum.photos/200/300").build(),
    ])
    .build();

  const pageLayout = LayoutElement.builder()
    .elements([imageLayout, inputLayout])
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
      await ShowHomeSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
