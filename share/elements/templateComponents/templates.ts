import { Builder, IBuilder } from "builder-pattern";

import { Element } from "../../domain/interfaces";

// TEMPLATE element
export class DefaultTemplate extends Element {
  interfaceName = "DefaultTemplate";

  widgets: Element[];

  static builder(): IBuilder<DefaultTemplate> {
    return Builder(DefaultTemplate);
  }
}
