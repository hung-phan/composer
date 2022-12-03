import { Builder, IBuilder } from "builder-pattern";

import { Element, Method } from "../../domain/interfaces";
import getNewId, { Id } from "../../library/idGenerator";

// TEMPLATE element
export class Template extends Element {
  interfaceName = "Template";

  ownerId: Id = getNewId();

  static builder(): IBuilder<Template> {
    return Builder(Template);
  }
}

export class DefaultTemplate extends Template {
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
