import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "../../../../share/domain/engine/serializers";
import {
  PlaceholderElement,
  Response,
  UpdateInListElementMethod,
} from "../../../../share/domain/interfaces";
import { TextElement } from "../../../../share/elements/components/widgets";

async function InfiniteLoadingLoadMoreSkill(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const INFINITE_SCROLL_ITEM_PLACEHOLDER_ID =
    "INFINITE_SCROLL_ITEM_PLACEHOLDER_ID";

  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 2000);
  });

  res.status(200).send(
    encode(
      Response.builder()
        .methods([
          UpdateInListElementMethod.builder()
            .id(INFINITE_SCROLL_ITEM_PLACEHOLDER_ID)
            .elements([
              ..._.range(0, 5).map(() =>
                TextElement.builder()
                  .message(`This is element ${Math.random()}`)
                  .build()
              ),
              PlaceholderElement.builder()
                .id(INFINITE_SCROLL_ITEM_PLACEHOLDER_ID)
                .build(),
            ])
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