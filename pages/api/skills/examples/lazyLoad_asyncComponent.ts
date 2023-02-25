import { IBuilder } from "builder-pattern";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodRequestBody,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import { Button, Image, Layout, Text } from "share/elements/components/widgets";

async function LazyLoadAsyncComponentSkill(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestData }: HttpMethodRequestBody<string, any> = req.body;

  const layoutElement = Layout.builder()
    .id(requestData.data)
    .elements([
      Text.builder().message(`This is image for ${requestData.data}`).build(),
      Image.builder()
        .id(`${requestData.data}_IMAGE`)
        .src(`https://picsum.photos/400?random=${_.random(0, 1000, false)}`)
        .class("w-48")
        .build(),
      Button.builder()
        .label("Click me")
        .onSelected([
          (HttpMethod.builder() as IBuilder<HttpMethod<string>>)
            .url("/api/skills/examples/lazyLoad_updateImage")
            .requestType("POST")
            .requestData({
              data: `${requestData.data}_IMAGE`,
            })
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
      await LazyLoadAsyncComponentSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
