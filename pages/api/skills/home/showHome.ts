import { NextApiRequest, NextApiResponse } from "next";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import {
  Button,
  Form,
  FormField,
  Image,
  Input,
  InputState,
  Layout,
  Link,
  Text,
} from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";
import getNewId from "share/library/idGenerator";

const searchInputName = "search";

export interface SearchFormInput {
  [searchInputName]: string;
}

async function ShowHomeSkill(_: NextApiRequest, res: NextApiResponse) {
  const imageLayout = Layout.builder()
    .elements([
      Image.builder()
        .src("https://picsum.photos/200/300")
        .class("w-48")
        .build(),
    ])
    .build();

  const INPUT_BOX_STATE_HOLDER = getNewId();

  const searchInputState = InputState.builder()
    .id(INPUT_BOX_STATE_HOLDER)
    .value("")
    .build();

  const formElement = Form.builder()
    .formId("searchForm")
    .action("/api/skills/home/handleHomeSearch")
    .method("post")
    .fields([
      FormField.builder()
        .fieldElement(
          Input.builder()
            .stateId(INPUT_BOX_STATE_HOLDER)
            .name(searchInputName)
            .placeholder("Search any music here")
            .onEnterKeyPressed([
              HttpMethod.builder()
                .url("/api/skills/home/handleHomeSearch")
                .requestType("POST")
                .stateIds([INPUT_BOX_STATE_HOLDER])
                .build(),
            ])
            .build()
        )
        .build(),
    ])
    .submitButton(Button.builder().type("submit").label("Search").build())
    .build();

  const formLayout = Layout.builder()
    .elements([formElement, searchInputState])
    .build();

  const linkLayout = Layout.builder()
    .elements([
      Link.builder()
        .url("/lazyLoad")
        .element(Text.builder().message("Lazy load example").build())
        .build(),
      Link.builder()
        .url("/infiniteLoading")
        .element(Text.builder().message("Infinite loading example").build())
        .build(),
      Link.builder()
        .url("/loadTest")
        .element(Text.builder().message("Load test example").build())
        .build(),
      Link.builder()
        .url("/complexState")
        .element(Text.builder().message("Complex state example").build())
        .build(),
    ])
    .build();

  const pageLayout = Layout.builder()
    .elements([imageLayout, formLayout, linkLayout])
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
