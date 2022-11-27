import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "../../../../share/domain/engine/serializers";
import {
  RenderElementMethod,
  Response,
} from "../../../../share/domain/interfaces";
import {
  InfiniteScrollElementState,
  TextElement,
} from "../../../../share/elements/components/widgets";

async function InfiniteLoadingLoadMoreSkill(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const INFINITE_SCROLL_STATE_ID = "INFINITE_SCROLL_STATE_ID";

  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 10000);
  });

  res.status(200).send(
    encode(
      Response.builder()
        .methods([
          RenderElementMethod.builder()
            .element(
              InfiniteScrollElementState.builder()
                .id(INFINITE_SCROLL_STATE_ID)
                .hasMore(false)
                .items([
                  TextElement.builder()
                    .message(`This is element ${Math.random()}`)
                    .build(),
                  TextElement.builder()
                    .message(`This is element ${Math.random()}`)
                    .build(),
                  TextElement.builder()
                    .message(`This is element ${Math.random()}`)
                    .build(),
                ])
                .build()
            )
            .build(),
        ])
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
      await InfiniteLoadingLoadMoreSkill(req, res);

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
