import { DataContainer, Element, Method } from "../../domain/interfaces";
import { Id } from "../../library/idGenerator";

// LAYOUT elements
export class Layout extends Element {
  interfaceName = "Layout";

  direction?: "vertical" | "horizontal";

  elements: Element[];
}

// CORE elements
export class Clone extends Element {
  interfaceName = "Clone";

  cloneElementId: Id;
}

export class Text extends Element {
  interfaceName = "Text";

  type?: string;
  message: string;
}

export class Link extends Element {
  interfaceName = "Link";

  url: string;
  element: Element;
}

export class Button extends Element {
  interfaceName = "Button";

  type?: "button" | "submit" | "reset";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "lg";
  color?: string;

  label?: string;
  onSelected?: Method[];
}

export class Image extends Element {
  interfaceName = "Image";

  src: string;
  alt?: string;
}

export class InputState extends DataContainer {
  interfaceName = "InputElementState";

  value: string = "";
}

export class Input extends Element {
  interfaceName = "Input";

  name?: string;
  placeholder?: string;
  onInputChange?: Method[];
  onEnterKeyPressed?: Method[];
}

export class SelectState extends DataContainer {
  interfaceName = "SelectElementState";

  value: string;
}

export class Select extends Element {
  interfaceName = "Select";

  defaultValue?: string;
  itemDescriptions: string[];
  itemValues: string[];
  onItemSelected: Method[];
}

export type SimpleTableRow = (string | number)[];

export class Table extends Element {
  interfaceName = "Table";

  headers: SimpleTableRow;
  rows: SimpleTableRow[];
}

export class Form extends Element {
  interfaceName = "Form";

  formId: string;
  action: string;
  method?: "get" | "post";
  fields: FormField[];
  submitButton: Button;
}

export class FormField extends Element {
  interfaceName = "FormField";

  fieldName: string;
  fieldElement: Input;
}

export class InfiniteScrollState extends DataContainer {
  interfaceName = "InfiniteScrollElementState";

  hasMore: boolean;
  items: Element[];
}

export class InfiniteScroll extends Element {
  interfaceName = "InfiniteScroll";

  loadMore: Method[];
  loader: Element;
}
