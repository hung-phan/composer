import { NextApiRequest, NextApiResponse } from "next";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import {
  ButtonElement,
  InputElement,
  InputElementState,
  LayoutElement,
} from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";

async function ComplexStateSkill(_: NextApiRequest, res: NextApiResponse) {
  const pageLayout = LayoutElement.builder()
    .elements([
      InputElementState.builder().id("input_1").build(),
      InputElementState.builder().id("input_2").build(),
      InputElementState.builder().id("input_3").build(),
      InputElement.builder().stateId("input_1").placeholder("Input 1").build(),
      InputElement.builder().stateId("input_2").placeholder("Input 2").build(),
      InputElement.builder().stateId("input_3").placeholder("Input 3").build(),
      ButtonElement.builder()
        .label("Submit")
        .onSelected([
          HttpMethod.builder()
            .url("/api/skills/examples/handleComplexState")
            .requestType("POST")
            .clientStateIds(["input_1", "input_2", "input_3"])
            .build(),
        ])
        .build(),
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
      await ComplexStateSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
