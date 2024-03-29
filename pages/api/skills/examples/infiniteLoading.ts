import { NextApiRequest, NextApiResponse } from "next";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  Placeholder,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import {
  InfiniteScroll,
  InfiniteScrollState,
  Layout,
  Text,
} from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";

async function InfiniteLoadingSkill(_: NextApiRequest, res: NextApiResponse) {
  const INFINITE_SCROLL_ELEMENT_ID = "INFINITE_SCROLL_ELEMENT_ID";
  const INFINITE_SCROLL_STATE_ID = "INFINITE_SCROLL_STATE_ID";
  const INFINITE_SCROLL_ITEM_PLACEHOLDER_ID =
    "INFINITE_SCROLL_ITEM_PLACEHOLDER_ID";

  const pageLayout = Layout.builder()
    .elements([
      InfiniteScrollState.builder()
        .id(INFINITE_SCROLL_STATE_ID)
        .hasMore(true)
        .items([
          Placeholder.builder().id(INFINITE_SCROLL_ITEM_PLACEHOLDER_ID).build(),
        ])
        .build(),
      InfiniteScroll.builder()
        .id(INFINITE_SCROLL_ELEMENT_ID)
        .stateId(INFINITE_SCROLL_STATE_ID)
        .loader(Text.builder().message("Loading ...").build())
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
