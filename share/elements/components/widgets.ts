import { Builder, IBuilder } from "builder-pattern";

import { Element, ElementState, Method } from "../../domain/interfaces";

// LAYOUT elements
export class LayoutElement extends Element {
  interfaceName = "LayoutElement";

  elements: Element[];

  static builder(): IBuilder<LayoutElement> {
    return Builder(LayoutElement);
  }
}

// CORE elements
export class DataElement extends Element {
  interfaceName = "DataElement";

  data: string | number;

  static builder(): IBuilder<DataElement> {
    return Builder(DataElement);
  }
}

export class TextElement extends Element {
  interfaceName = "TextElement";

  type?: string;
  message: string;

  static builder(): IBuilder<TextElement> {
    return Builder(TextElement);
  }
}

export class LinkElement extends Element {
  interfaceName = "LinkElement";

  url: string;
  element: Element;

  static builder(): IBuilder<LinkElement> {
    return Builder(LinkElement);
  }
}

export class ButtonElement extends Element {
  interfaceName = "ButtonElement";

  type?: "button" | "submit" | "reset";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "lg";
  color?: string;

  label?: string;
  onSelected?: Method[];

  static builder(): IBuilder<ButtonElement> {
    return Builder<ButtonElement>(ButtonElement);
  }
}

export class ImageElement extends Element {
  interfaceName = "ImageElement";

  src: string;
  alt?: string;

  static builder(): IBuilder<ImageElement> {
    return Builder(ImageElement);
  }
}

export type InputElementState = ElementState<string>;

export class InputElement extends Element {
  interfaceName = "InputElement";

  name?: string;
  defaultValue = "";
  placeholder?: string;
  onInputChange?: Method[];
  onEnterKeyPressed?: Method[];

  static builder(): IBuilder<InputElement> {
    return Builder(InputElement);
  }
}

export type SelectElementState = ElementState<string>;

export class SelectElement extends Element {
  interfaceName = "SelectElement";

  defaultValue?: string;
  itemDescriptions: string[];
  itemValues: string[];
  onItemSelected: Method[];

  static builder(): IBuilder<SelectElement> {
    return Builder(SelectElement);
  }
}

export type SimpleTableRow = (string | number)[];

export class TableElement extends Element {
  interfaceName = "TableElement";

  headers: SimpleTableRow;
  rows: SimpleTableRow[];

  static builder(): IBuilder<TableElement> {
    return Builder(TableElement);
  }
}

export class FormElement extends Element {
  interfaceName = "FormElement";

  formId: string;
  action: string;
  method?: "get" | "post";
  fields: FormFieldElement[];
  submitButton: ButtonElement;

  static builder(): IBuilder<FormElement> {
    return Builder(FormElement);
  }
}

export class FormFieldElement extends Element {
  interfaceName = "FormFieldElement";

  fieldName: string;
  fieldElement: InputElement;

  static builder(): IBuilder<FormFieldElement> {
    return Builder(FormFieldElement);
  }
}
