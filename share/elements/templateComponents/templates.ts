import { Builder, IBuilder } from "builder-pattern";

import { Element, Method } from "../../domain/interfaces";

// TEMPLATE element
export class DefaultTemplate extends Element {
  interfaceName = "DefaultTemplate";

  widgets: Element[];

  static builder(): IBuilder<DefaultTemplate> {
    return Builder(DefaultTemplate);
  }
}

export class PeriodicTemplate extends DefaultTemplate {
  interfaceName = "PeriodicTemplate";

  intervalInMs: number;
  methods: Method[];

  static builder(): IBuilder<PeriodicTemplate> {
    return Builder(PeriodicTemplate);
  }
}
