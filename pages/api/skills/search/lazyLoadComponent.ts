import { Builder } from "builder-pattern";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "../../../../share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodRequestBody,
  RenderElementMethod,
  RequestData,
  Response,
} from "../../../../share/domain/interfaces";
import {
  ButtonElement,
  ImageElement,
  LayoutElement,
  TextElement,
} from "../../../../share/elements/components/widgets";

async function LazyLoadComponentSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestData }: HttpMethodRequestBody<string, any, any> = req.body;

  const layoutElement = LayoutElement.builder()
    .id(requestData.data)
    .elements([
      TextElement.builder()
        .message(`This is image for ${requestData.data}`)
        .build(),
      ImageElement.builder()
        .id(`${requestData.data}_IMAGE`)
        .src(`https://picsum.photos/400?random=${_.random(0, 1000, false)}`)
        .build(),
      ButtonElement.builder()
        .label("Click me")
        .onSelected([
          HttpMethod.builder()
            .url("/api/skills/search/updateSearchImage")
            .requestType("POST")
            .requestData(
              Builder<RequestData<string>>()
                .data(`${requestData.data}_IMAGE`)
                .build()
            )
            .build(),
        ])
        .build(),
    ])
    .build();

  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 10000);
  });

  res.status(200).send(
    encode(
      Response.builder()
        .methods([RenderElementMethod.builder().element(layoutElement).build()])
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
      await LazyLoadComponentSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
