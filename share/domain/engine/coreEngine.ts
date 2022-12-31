import { Builder } from "builder-pattern";
import * as _ from "lodash";
import Router from "next/router";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import fetch from "../../library/fetch";
import { Id } from "../../library/idGenerator";
import { RootState } from "../../store";
import {
  BatchRenderElementMethod,
  ClientInfo,
  DataContainer,
  Element,
  HttpMethod,
  HttpMethodRequestBody,
  InvokeExternalMethod,
  Method,
  NavigateMethod,
  RenderElementMethod,
  Response,
  UpdateElementMethod,
  UpdateInListElementMethod,
  UpdateStateMethod,
} from "../interfaces";
import { getSimplifiedElement } from "./coreEngineHelpers";
import getTaskQueue, { TaskQueue } from "./coreEngineQueue";
import { actions, selectors } from "./coreEngineStateStore";
import { decode } from "./serializers";

class CoreEngine {
  readonly ownerId: Id;
  readonly taskQueue: TaskQueue;
  readonly dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
  readonly clientInfo?: ClientInfo<any>;
  actions: AnyAction[] = [];

  addToDispatchQueue(action: AnyAction) {
    this.actions.push(action);
  }

  flushDispatchQueue() {
    if (_.isEmpty(this.actions)) {
      return;
    }

    this.dispatch(actions.handleCoreEngineActions(this.actions));

    this.actions = [];
  }
}

async function evalMethod(
  method: Method,
  coreEngine: CoreEngine
): Promise<void> {
  if (method === null) {
    return;
  }

  if (method instanceof InvokeExternalMethod) {
    coreEngine.addToDispatchQueue(method.action);
  } else if (method instanceof UpdateStateMethod) {
    coreEngine.addToDispatchQueue(
      actions.updateStateElement({
        stateElementId: method.stateElementId,
        patches: method.patches,
      })
    );
  } else if (method instanceof HttpMethod) {
    if (_.isEmpty(method.stateIds)) {
      await makeHttpCall(method, coreEngine);
    } else {
      await coreEngine.dispatch((__, getState) => {
        const currentState = getState();

        return makeHttpCall(
          method,
          coreEngine,
          method.stateIds.map((clientStateId) =>
            selectors.getElementState(currentState, clientStateId)
          )
        );
      });
    }
  } else if (method instanceof RenderElementMethod) {
    await registerElement(method.element, coreEngine);
  } else if (method instanceof BatchRenderElementMethod) {
    await Promise.all(
      method.elements.map((element) => registerElement(element, coreEngine))
    );
  } else if (method instanceof UpdateElementMethod) {
    await coreEngine.dispatch(async (__, getState) => {
      const parentElement = selectors.getParentElement(getState(), method.id);

      await registerElement(method.element, coreEngine);

      coreEngine.addToDispatchQueue(
        actions.replaceElement({
          parentId: parentElement.id,
          oldId: method.id,
          id: method.element.id,
        })
      );
    });
  } else if (method instanceof UpdateInListElementMethod) {
    await Promise.all(
      method.elements.map((element) => registerElement(element, coreEngine))
    );
    coreEngine.addToDispatchQueue(
      actions.replaceElementInList({
        oldId: method.id,
        ids: method.elements.map((element) => element.id),
      })
    );
  } else if (method instanceof NavigateMethod) {
    if (process.env.ENVIRONMENT === "client") {
      await Router.push(method.url);
    } else {
      throw new Error(
        `Unsupported method for serverSide: ${method.interfaceName}`
      );
    }
  } else {
    throw new Error(`Unsupported method: ${method.interfaceName}`);
  }
}

async function makeHttpCall(
  method: HttpMethod<any>,
  coreEngine: CoreEngine,
  elementStates?: DataContainer[]
): Promise<void> {
  if (method.requestType === undefined) {
    throw new Error("requestType cannot be undefined");
  }

  if (method.before) {
    await dispatchTask(coreEngine, method.before);
  }

  try {
    const requestOptions: RequestInit = {};
    const requestBody: HttpMethodRequestBody<any, any> = {
      elementStates,
      clientInfo: coreEngine.clientInfo,
      requestData: method.requestData,
    };
    let serverUrl = method.url;

    if (method.requestType === "GET") {
      serverUrl += `?${Object.entries(requestBody)
        .filter(([, value]) => value !== undefined)
        .map(
          ([key, value]) =>
            `${key}=${encodeURIComponent(JSON.stringify(value))}`
        )
        .join("&")}`;
    } else if (method.requestType === "POST") {
      requestOptions.body = JSON.stringify(requestBody);
    }

    const response = await fetch(serverUrl, {
      ...requestOptions,
      method: method.requestType,
    });

    if (response.ok) {
      const responseObj = decode<Response>(await response.text());

      if (method.onSuccess) {
        await dispatchTask(coreEngine, method.onSuccess);
      }

      await dispatchTask(coreEngine, responseObj.methods);
    } else if (method.onError) {
      await dispatchTask(coreEngine, method.onError);
    }
  } catch (e) {
    console.error(e);

    if (method.onError) {
      await dispatchTask(coreEngine, method.onError);
    }
  }

  if (method.after) {
    await dispatchTask(coreEngine, method.after);
  }
}

async function registerElement(
  element: Element,
  coreEngine: CoreEngine
): Promise<void> {
  const childElements: Element[] = [];

  for (const [key, value] of Object.entries(element)) {
    if (value instanceof Element) {
      await coreEngine.taskQueue.run(registerElement, value, coreEngine);

      element[key] = getSimplifiedElement(value);

      childElements.push(element[key]);
    }

    if (
      _.isArray(value) &&
      _.every(value, (nestedElement) => nestedElement instanceof Element)
    ) {
      await Promise.all(
        value.map((nestedElement) =>
          coreEngine.taskQueue.run(registerElement, nestedElement, coreEngine)
        )
      );

      element[key] = value.map((nestedElement) =>
        getSimplifiedElement(nestedElement)
      );
      childElements.push(...element[key]);
    }
  }

  coreEngine.addToDispatchQueue(
    actions.setElement({
      element,
      childIds: new Set(childElements.map((nestedElement) => nestedElement.id)),
    })
  );
}

async function dispatchTask(coreEngine: CoreEngine, methods?: Method[]) {
  if (_.isEmpty(methods)) {
    return;
  }

  await coreEngine.dispatch(async (__, getState) => {
    if (
      coreEngine.ownerId !== selectors.getCurrentTemplateOwnerId(getState())
    ) {
      return;
    }

    try {
      await Promise.all(
        methods.map((method) => evalMethod(method, coreEngine))
      );

      coreEngine.flushDispatchQueue();
    } catch (e) {
      console.error(e);
    }
  });
}

export async function engineDispatch(
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
  methods?: Method[],
  clientInfo?: ClientInfo<any>
): Promise<void> {
  if (_.isEmpty(methods)) {
    return;
  }

  await dispatch(async (__, getState) => {
    const coreEngine = Builder(CoreEngine)
      .ownerId(selectors.getCurrentTemplateOwnerId(getState()))
      .taskQueue(getTaskQueue())
      .dispatch(dispatch)
      .clientInfo(clientInfo)
      .build();

    return dispatchTask(coreEngine, methods);
  });
}
