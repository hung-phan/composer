import { Builder, IBuilder } from "builder-pattern";

import { DataContainer, Element, Method } from "../../domain/interfaces";
import { Id } from "../../library/idGenerator";

// LAYOUT elements
export class Layout extends Element {
  interfaceName = "Layout";

  direction?: "vertical" | "horizontal";

  elements: Element[];

  static builder(): IBuilder<Layout> {
    return Builder(Layout);
  }
}

// CORE elements
export class Clone extends Element {
  interfaceName = "Clone";

  cloneElementId: Id;

  static builder(): IBuilder<Clone> {
    return Builder(Clone);
  }
}

export class Text extends Element {
  interfaceName = "Text";

  type?: string;
  message: string;

  static builder(): IBuilder<Text> {
    return Builder(Text);
  }
}

export class Link extends Element {
  interfaceName = "Link";

  url: string;
  element: Element;

  static builder(): IBuilder<Link> {
    return Builder(Link);
  }
}

export class Button extends Element {
  interfaceName = "Button";

  type?: "button" | "submit" | "reset";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "lg";
  color?: string;

  label?: string;
  onSelected?: Method[];

  static builder(): IBuilder<Button> {
    return Builder<Button>(Button);
  }
}

export class Image extends Element {
  interfaceName = "Image";

  src: string;
  alt?: string;

  static builder(): IBuilder<Image> {
    return Builder(Image);
  }
}

export class InputState extends DataContainer {
  interfaceName = "InputElementState";

  value: string = "";

  static builder(): IBuilder<InputState> {
    return Builder(InputState);
  }
}

export class Input extends Element {
  interfaceName = "Input";

  name?: string;
  placeholder?: string;
  onInputChange?: Method[];
  onEnterKeyPressed?: Method[];

  static builder(): IBuilder<Input> {
    return Builder(Input);
  }
}

export class SelectState extends DataContainer {
  interfaceName = "SelectElementState";

  value: string;

  static builder(): IBuilder<SelectState> {
    return Builder(SelectState);
  }
}

export class Select extends Element {
  interfaceName = "Select";

  defaultValue?: string;
  itemDescriptions: string[];
  itemValues: string[];
  onItemSelected: Method[];

  static builder(): IBuilder<Select> {
    return Builder(Select);
  }
}

export type SimpleTableRow = (string | number)[];

export class Table extends Element {
  interfaceName = "Table";

  headers: SimpleTableRow;
  rows: SimpleTableRow[];

  static builder(): IBuilder<Table> {
    return Builder(Table);
  }
}

export class Form extends Element {
  interfaceName = "Form";

  formId: string;
  action: string;
  method?: "get" | "post";
  fields: FormField[];
  submitButton: Button;

  static builder(): IBuilder<Form> {
    return Builder(Form);
  }
}

export class FormField extends Element {
  interfaceName = "FormField";

  fieldName: string;
  fieldElement: Input;

  static builder(): IBuilder<FormField> {
    return Builder(FormField);
  }
}

export class InfiniteScrollState extends DataContainer {
  interfaceName = "InfiniteScrollElementState";

  hasMore: boolean;
  items: Element[];

  static builder(): IBuilder<InfiniteScrollState> {
    return Builder(InfiniteScrollState);
  }
}

export class InfiniteScroll extends Element {
  interfaceName = "InfiniteScroll";

  loadMore: Method[];
  loader: Element;

  static builder(): IBuilder<InfiniteScroll> {
    return Builder(InfiniteScroll);
  }
}
