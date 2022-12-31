import { Builder, IBuilder } from "builder-pattern";
import { Patch, immerable } from "immer";
import _ from "lodash";
import { Action } from "redux";

import getNewId, { Id } from "../../library/idGenerator";

export abstract class Serializable {
  [immerable] = true;

  abstract interfaceName: string;
}

export class Method extends Serializable {
  interfaceName = "Method";

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Method> {
    return Builder(Method);
  }
}

export class Element extends Serializable {
  interfaceName = "Element";

  id: Id = getNewId();

  class?: string;
  stateId?: Id;

  onCreate?: Method[];
  onDestroy?: Method[];

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Element> {
    return Builder(Element);
  }
}

export class Node extends Serializable {
  interfaceName = "Node";

  parent?: Id;
  childs?: { [key: Id]: boolean };
  element?: Element;

  setParent(id?: Id): void {
    if (id === undefined) {
      delete this.parent;
      return;
    }

    this.parent = id;
  }

  hasChild(id: Id): boolean {
    if (this.childs === undefined) {
      return false;
    }

    return id in this.childs;
  }

  addChild(id: Id): void {
    if (this.childs === undefined) {
      this.childs = {};
    }

    this.childs[id] = true;
  }

  removeChild(id: Id): void {
    if (this.childs === undefined) {
      return;
    }

    delete this.childs[id];

    if (_.isEmpty(this.childs)) {
      delete this.childs;
    }
  }

  removeAllChild(): void {
    delete this.childs;
  }

  replaceChildElement(oldChildId: Id, childElement: Element) {
    for (const [key, value] of Object.entries(this.element)) {
      if (value instanceof Element && value.id === oldChildId) {
        this.element[key] = childElement;
        return;
      } else if (_.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index--) {
          if (
            value[index] instanceof Element &&
            value[index].id === oldChildId
          ) {
            value[index] = childElement;
            return;
          }
        }
      }
    }
  }

  replaceChildElementInList(oldChildId: Id, childElements: Element[]) {
    for (const value of Object.values(this.element)) {
      if (_.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index--) {
          if (
            value[index] instanceof Element &&
            value[index].id === oldChildId
          ) {
            value.splice(index, 1, ...childElements);

            return;
          }
        }
      }
    }
  }

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Node> {
    return Builder(Node);
  }
}

export class Placeholder extends Element {
  interfaceName = "Placeholder";

  static builder(): IBuilder<Placeholder> {
    return Builder(Placeholder);
  }
}

export class DataContainer extends Element {
  interfaceName = "DataContainer";

  static builder(): IBuilder<DataContainer> {
    return Builder(DataContainer);
  }
}

export interface RawDataContainer<T> {
  data: T;
}

export class Response extends Serializable {
  interfaceName = "Response";

  methods: Method[];

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Response> {
    return Builder(Response);
  }

  static readonly EMPTY = Response.builder().methods([]).build();
}

export type RequestType = "GET" | "POST";

export class InvokeExternalMethod extends Method {
  interfaceName = "InvokeExternalMethod";

  action: Action;

  static builder(): IBuilder<InvokeExternalMethod> {
    return Builder(InvokeExternalMethod);
  }
}

export class UpdateStateMethod extends Method {
  interfaceName = "UpdateStateMethod";

  stateElementId: Id;
  patches: Patch[];

  static builder(): IBuilder<UpdateStateMethod> {
    return Builder(UpdateStateMethod);
  }
}

export class RenderElementMethod extends Method {
  interfaceName = "RenderElementMethod";

  element: Element;

  static builder(): IBuilder<RenderElementMethod> {
    return Builder(RenderElementMethod);
  }
}

export class BatchRenderElementMethod extends Method {
  interfaceName = "BatchRenderElementMethod";

  elements: Element[];

  static builder(): IBuilder<BatchRenderElementMethod> {
    return Builder(BatchRenderElementMethod);
  }
}

export class UpdateElementMethod extends Method {
  interfaceName = "UpdateElementMethod";

  id: Id;
  element: Element;

  static builder(): IBuilder<UpdateElementMethod> {
    return Builder(UpdateElementMethod);
  }
}

export class UpdateInListElementMethod extends Method {
  interfaceName = "UpdateInListElementMethod";

  id: Id;
  elements: Element[];

  static builder(): IBuilder<UpdateInListElementMethod> {
    return Builder(UpdateInListElementMethod);
  }
}

export type RequestData<T> = RawDataContainer<T>;

export class HttpMethod<T> extends Method {
  interfaceName = "HttpMethod";

  before?: Method[];
  after?: Method[];
  url: string;
  requestType: RequestType;
  requestData?: RequestData<T>;
  stateIds?: Id[];
  onError?: Method[];
  onSuccess?: Method[];

  static builder<T>(): IBuilder<HttpMethod<T>> {
    return Builder(HttpMethod<T>);
  }
}

export type ClientInfo<T> = RawDataContainer<T>;

export interface HttpMethodRequestBody<RequestDataType, ClientInfoType> {
  elementStates?: DataContainer[];
  requestData?: RequestData<RequestDataType>;
  clientInfo?: ClientInfo<ClientInfoType>;
}

export class NavigateMethod extends Method {
  interfaceName = "NavigateMethod";

  url: string;

  static builder(): IBuilder<NavigateMethod> {
    return Builder(NavigateMethod);
  }
}
