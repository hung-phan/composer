import { Element, Method } from "../../domain/interfaces";
import getNewId, { Id } from "../../library/idGenerator";

// TEMPLATE element
export class Template extends Element {
  interfaceName = "Template";

  ownerId: Id = getNewId();
}

export class DefaultTemplate extends Template {
  interfaceName = "DefaultTemplate";

  widgets: Element[];
}

export class PeriodicTemplate extends DefaultTemplate {
  interfaceName = "PeriodicTemplate";

  intervalInMs: number;
  methods: Method[];
}
