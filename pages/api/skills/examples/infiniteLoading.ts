import { NextApiRequest, NextApiResponse } from "next";

import { ROOT_ID } from "../../../../share/domain/engine";
import { encode } from "../../../../share/domain/engine/serializers";
import {
  HttpMethod,
  RenderElementMethod,
  Response,
} from "../../../../share/domain/interfaces";
import {
  InfiniteScrollElement,
  InfiniteScrollElementState,
  LayoutElement,
  TextElement,
} from "../../../../share/elements/components/widgets";
import { DefaultTemplate } from "../../../../share/elements/templateComponents/templates";

async function InfiniteLoadingSkill(_: NextApiRequest, res: NextApiResponse) {
  const INFINITE_SCROLL_ELEMENT_ID = "INFINITE_SCROLL_ELEMENT_ID";
  const INFINITE_SCROLL_STATE_ID = "INFINITE_SCROLL_STATE_ID";

  const pageLayout = LayoutElement.builder()
    .elements([
      InfiniteScrollElementState.builder()
        .id(INFINITE_SCROLL_STATE_ID)
        .hasMore(true)
        .items([])
        .build(),
      InfiniteScrollElement.builder()
        .id(INFINITE_SCROLL_ELEMENT_ID)
        .stateId(INFINITE_SCROLL_STATE_ID)
        .loader(TextElement.builder().message("Loading ...").build())
        .loadMore([
          HttpMethod.builder()
            .url("/api/skills/examples/infiniteLoading_loadMore")
            .requestType("GET")
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
      await InfiniteLoadingSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
