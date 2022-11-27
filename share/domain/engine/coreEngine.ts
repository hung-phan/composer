import { Builder } from "builder-pattern";
import * as _ from "lodash";
import Router from "next/router";
import { DefaultRootState } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import fetch from "../../library/fetch";
import {
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
} from "../interfaces";
import { getSimplifiedElement } from "./coreEngineHelpers";
import getTaskQueue, { TaskQueue } from "./coreEngineQueue";
import { actions, selectors } from "./coreEngineStateStore";
import { decode } from "./serializers";

class CoreEngine {
  readonly taskQueue: TaskQueue;
  readonly dispatch: ThunkDispatch<DefaultRootState, unknown, AnyAction>;
  readonly clientInfo?: ClientInfo<any>;
}

async function evalMethod(
  method: Method,
  coreEngine: CoreEngine
): Promise<void> {
  if (method === null) {
    return;
  }

  if (method instanceof InvokeExternalMethod) {
    coreEngine.dispatch(method.data);
  } else if (method instanceof HttpMethod) {
    if (method.clientStateId !== undefined) {
      await coreEngine.dispatch((__, getState) =>
        makeHttpCall(
          method,
          coreEngine,
          selectors.getElementState(getState(), method.clientStateId)
        )
      );
    } else {
      await makeHttpCall(method, coreEngine);
    }
  } else if (method instanceof RenderElementMethod) {
    await registerElement(method.element, coreEngine);
  } else if (method instanceof UpdateElementMethod) {
    await coreEngine.dispatch(async (__, getState) => {
      const parentElement = selectors.getParentElement(getState(), method.id);

      await registerElement(method.element, coreEngine);

      coreEngine.dispatch(
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
    coreEngine.dispatch(
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
  elementState?: DataContainer
): Promise<void> {
  if (method.requestType === undefined) {
    throw new Error("requestType cannot be undefined");
  }

  if (method.before) {
    await dispatchTask(
      coreEngine.taskQueue,
      coreEngine.dispatch,
      method.before,
      coreEngine.clientInfo
    );
  }

  try {
    const requestOptions: RequestInit = {};
    const requestBody: HttpMethodRequestBody<any, any> = {
      elementState,
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
        await dispatchTask(
          coreEngine.taskQueue,
          coreEngine.dispatch,
          method.onSuccess,
          coreEngine.clientInfo
        );
      }

      await dispatchTask(
        coreEngine.taskQueue,
        coreEngine.dispatch,
        responseObj.methods,
        coreEngine.clientInfo
      );
    } else if (method.onError) {
      await dispatchTask(
        coreEngine.taskQueue,
        coreEngine.dispatch,
        method.onError,
        coreEngine.clientInfo
      );
    }
  } catch (e) {
    console.error(e);

    if (method.onError) {
      await dispatchTask(
        coreEngine.taskQueue,
        coreEngine.dispatch,
        method.onError,
        coreEngine.clientInfo
      );
    }
  }

  if (method.after) {
    await dispatchTask(
      coreEngine.taskQueue,
      coreEngine.dispatch,
      method.after,
      coreEngine.clientInfo
    );
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

  coreEngine.dispatch(
    actions.setElement({
      element,
    })
  );

  if (!_.isEmpty(childElements)) {
    coreEngine.dispatch(
      actions.registerParent({
        parentId: element.id,
        ids: childElements.map((nestedElement) => nestedElement.id),
      })
    );
  }
}

async function dispatchTask(
  taskQueue: TaskQueue,
  dispatch: ThunkDispatch<DefaultRootState, unknown, AnyAction>,
  methods?: Method[],
  clientInfo?: ClientInfo<any>
) {
  if (_.isEmpty(methods)) {
    return;
  }

  const coreEngine = Builder(CoreEngine)
    .taskQueue(taskQueue)
    .dispatch(dispatch)
    .clientInfo(clientInfo)
    .build();

  try {
    await Promise.all(methods.map((method) => evalMethod(method, coreEngine)));
  } catch (e) {
    console.error(e);
  }
}

export function engineDispatch(
  dispatch: ThunkDispatch<DefaultRootState, unknown, AnyAction>,
  methods?: Method[],
  clientInfo?: ClientInfo<any>
): Promise<void> {
  if (_.isEmpty(methods)) {
    return;
  }

  return dispatchTask(getTaskQueue(), dispatch, methods, clientInfo);
}
