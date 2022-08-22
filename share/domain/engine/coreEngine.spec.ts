import {
  ButtonElement,
  ImageElement,
  LayoutElement,
  TextElement,
} from "../../elements/components/widgets";
import { makeStore } from "../../store";
import {
  PlaceholderElement,
  RenderElementMethod,
  StateHolderElement,
  UpdateElementMethod,
  UpdateInListElementMethod,
} from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { ROOT_ID } from "./index";

describe("coreEngine", () => {
  test("should update the store correctly", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              TextElement.builder().id("text_element").build(),
              ImageElement.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              ButtonElement.builder().id("button_element").build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
              StateHolderElement.builder()
                .id("stateholder_element")
                .elementState({ data: ["string_data"] })
                .build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support override element with RenderElementMethod", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              ImageElement.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id("placeholder_element")
            .elements([
              TextElement.builder().id("text_element").build(),
              ButtonElement.builder().id("button_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should remove element with RenderElementMethod", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              ImageElement.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              LayoutElement.builder()
                .id("placeholder_element")
                .elements([
                  TextElement.builder().id("text_element").build(),
                  ButtonElement.builder().id("button_element").build(),
                ])
                .build()
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          PlaceholderElement.builder().id("placeholder_element").build(),
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support list replacement with same id", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              TextElement.builder().id("text_element_1").build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      UpdateInListElementMethod.builder()
        .id("placeholder_element")
        .elements([
          TextElement.builder().id("text_element_2").build(),
          PlaceholderElement.builder().id("placeholder_element").build(),
        ])
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support nested element update with same id", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              ImageElement.builder().id("image_element_1").build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      UpdateElementMethod.builder()
        .id("placeholder_element")
        .element(
          LayoutElement.builder()
            .id("nested_layout_element")
            .elements([
              ImageElement.builder().id("image_element_2").build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });
});
