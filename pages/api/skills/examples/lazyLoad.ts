import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { getQueryData } from "server/infrastructure/application/helpers";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodBuilder,
  Placeholder,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import { Image, Layout } from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";

async function LazyLoadSkill(req: NextApiRequest, res: NextApiResponse) {
  const query = getQueryData(req, "query");

  console.log(query);

  const COMPONENT_IDS = _.range(0, 10).map((val) => "COMPONENT_" + val);

  const pageLayout = Layout.builder()
    .elements([
      Image.builder()
        .src("https://picsum.photos/200/300")
        .class("w-48")
        .build(),
      ...COMPONENT_IDS.map((id) =>
        Placeholder.builder()
          .id(id)
          .onCreate([
            (HttpMethod.builder() as HttpMethodBuilder<string>)
              .url("/api/skills/examples/lazyLoad_asyncComponent")
              .requestType("POST")
              .requestData({ data: id })
              .build(),
          ])
          .build()
      ),
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
      await LazyLoadSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
