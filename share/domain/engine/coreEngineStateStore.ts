import produce, {
  Patch,
  applyPatches,
  enableMapSet,
  enablePatches,
  setAutoFreeze,
} from "immer";
import { DefaultRootState } from "react-redux";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { asyncFactory } from "typescript-fsa-redux-thunk";

import {
  Element,
  ElementState,
  HttpMethod,
  Id,
  Node,
  StateHolderElement,
} from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { ROOT_ID } from "./index";

enableMapSet();
enablePatches();
setAutoFreeze(false);

export type State = {
  [key: Id]: Node;
};

export const mountPoint = "templateEngine";

export const selectors = {
  getState: (state: DefaultRootState): State => state[mountPoint],
  getElement: (state: DefaultRootState, id: Id): Element | undefined => {
    const node: Node = state[mountPoint][id];

    if (node === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    return node.element;
  },
  getParentElement: (state: DefaultRootState, id: Id): Element | undefined => {
    const childNode: Node = state[mountPoint][id];

    if (childNode === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    const parentNode: Node = state[mountPoint][childNode.parent];

    if (parentNode === undefined) {
      throw new Error(`Cannot find parent element of ${id}`);
    }

    return parentNode.element;
  },
  getElementState: <T extends ElementState<any>>(
    state: DefaultRootState,
    id: Id
  ): T | undefined => {
    const node: Node = state[mountPoint][id];

    if (node === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    const element = node.element;

    if (element === undefined) {
      throw new Error(`StateHolderElement is undefined for ${id}`);
    }

    if (!(element instanceof StateHolderElement)) {
      throw new Error("Current element is not a StateHolderElement");
    }

    return element.elementState as T;
  },
};

const actionCreator = actionCreatorFactory(mountPoint);
const asyncActionCreator = asyncFactory<DefaultRootState>(actionCreator);

export enum ActionType {
  CALL_ENDPOINT = "CALL_ENDPOINT",
  SET_ELEMENT = "SET_ELEMENT",
  DEL_ELEMENT = "DEL_ELEMENT",
  REGISTER_PARENT = "REGISTER_PARENT",
  REPLACE_ELEMENT = "REPLACE_ELEMENT",
  REPLACE_ELEMENT_IN_LIST = "REPLACE_ELEMENT_IN_LIST",
  UPDATE_STATE_ELEMENT = "UPDATE_STATE_ELEMENT",
}

export const actions = {
  callEndpoint: asyncActionCreator<HttpMethod<any>, State>(
    ActionType.CALL_ENDPOINT,
    async (method, dispatch, getRootState) => {
      await engineDispatch(dispatch, [method]);

      return selectors.getState(getRootState());
    }
  ),
  setElement: actionCreator<{ element: Element }>(ActionType.SET_ELEMENT),
  delElement: actionCreator<{ id: Id; interfaceName: string }>(
    ActionType.DEL_ELEMENT
  ),
  registerParent: actionCreator<{ ids: Id[]; parentId: Id }>(
    ActionType.REGISTER_PARENT
  ),
  replaceElement: actionCreator<{
    parentId: Id;
    oldId: Id;
    id: Id;
  }>(ActionType.REPLACE_ELEMENT),
  replaceElementInList: actionCreator<{
    oldId: Id;
    ids: Id[];
  }>(ActionType.REPLACE_ELEMENT_IN_LIST),
  updateStateElement: actionCreator<{
    stateElementId: string;
    patches: Patch[];
  }>(ActionType.UPDATE_STATE_ELEMENT),
};

function deleteAllChildElements(state: State, id: Id): void {
  const childs = state[id]?.childs;

  if (childs === undefined) {
    return;
  }

  for (const child of childs) {
    deleteAllChildElements(state, child);
  }

  delete state[id];
}

function createNodeIfNotExist(state: State, id: Id) {
  if (id in state) {
    return;
  }

  state[id] = Node.builder().build();
}

export const reducer = reducerWithInitialState<State>({})
  .case(actions.setElement, (state, action) =>
    produce(state, (draft) => {
      const element = action.element;

      createNodeIfNotExist(draft, element.id);

      draft[element.id].element = element;

      const parentNode = draft[draft[element.id]?.parent];

      if (parentNode === undefined) {
        return;
      }

      // do inplace update and convert the current child interface to element interface
      parentNode.replaceChildElement(
        element.id,
        Element.builder()
          .id(element.id)
          .interfaceName(element.interfaceName)
          .build()
      );

      if (draft[element.id].childs !== undefined) {
        for (const child of draft[element.id].childs) {
          draft[child].setParent(undefined);
        }

        draft[element.id].removeAllChild();
      }
    })
  )
  .case(actions.delElement, (state, action) =>
    produce(state, (draft) => {
      if (
        action.id in draft &&
        action.interfaceName === draft[action.id].element.interfaceName
      ) {
        let id = action.id;
        let pointer = draft[id];

        while (pointer.parent !== undefined) {
          const childId = id;

          id = pointer.parent;
          pointer = draft[id];

          if (!pointer.hasChild(childId)) {
            deleteAllChildElements(draft, childId);
            return;
          }
        }

        if (id !== ROOT_ID) {
          delete draft[action.id];
        }
      }
    })
  )
  .case(actions.registerParent, (state, action) =>
    produce(state, (draft) => {
      createNodeIfNotExist(draft, action.parentId);

      for (const id of action.ids) {
        if (!draft[action.parentId].hasChild(id)) {
          createNodeIfNotExist(draft, id);

          draft[id].setParent(action.parentId);
          draft[action.parentId].addChild(id);
        }
      }
    })
  )
  .case(actions.replaceElement, (state, action) =>
    produce(state, (draft) => {
      const oldNode = draft[action.oldId];
      const parentNode = draft[action.parentId];

      if (parentNode === undefined) {
        return;
      }

      const newNode = draft[action.id];

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }
      newNode.setParent(parentNode.element.id);

      parentNode.replaceChildElement(
        action.oldId,
        Element.builder()
          .id(newNode.element.id)
          .interfaceName(newNode.element.interfaceName)
          .build()
      );
      parentNode.removeChild(action.oldId);
      parentNode.addChild(newNode.element.id);
    })
  )
  .case(actions.replaceElementInList, (state, action) =>
    produce(state, (draft) => {
      const oldNode = draft[action.oldId];
      const parentNode = draft[oldNode?.parent];

      if (parentNode === undefined) {
        return;
      }

      const newNodes = action.ids.map((id) => draft[id]);

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }

      parentNode.replaceChildElementInList(
        action.oldId,
        newNodes.map((newNode) =>
          Element.builder()
            .id(newNode.element.id)
            .interfaceName(newNode.element.interfaceName)
            .build()
        )
      );

      parentNode.removeChild(action.oldId);

      for (const newNode of newNodes) {
        parentNode.addChild(newNode.element.id);
        newNode.setParent(parentNode.element.id);
      }
    })
  )
  .case(actions.updateStateElement, (state, action) =>
    produce(state, (draft) => {
      const element = draft[action.stateElementId].element;

      if (!(element instanceof StateHolderElement)) {
        throw new Error("Can only update state of StateHolderElement");
      }

      applyPatches(element.elementState, action.patches);
    })
  );
