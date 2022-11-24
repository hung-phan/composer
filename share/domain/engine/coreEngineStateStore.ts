import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Patch,
  applyPatches,
  enableMapSet,
  enablePatches,
  setAutoFreeze,
} from "immer";
import { DefaultRootState } from "react-redux";

import {
  Element,
  ElementState,
  Id,
  Method,
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

const initialState: State = {};

const slice = createSlice({
  name: mountPoint,
  initialState,
  reducers: {
    setElement: (state, action: PayloadAction<{ element: Element }>) => {
      const element = action.payload.element;

      createNodeIfNotExist(state, element.id);

      state[element.id].element = element;

      const parentNode = state[state[element.id]?.parent];

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

      if (state[element.id].childs !== undefined) {
        for (const child of state[element.id].childs) {
          state[child].setParent(undefined);
        }

        state[element.id].removeAllChild();
      }
    },
    delElement: (
      state: State,
      action: PayloadAction<{ id: Id; interfaceName: string }>
    ) => {
      if (
        action.payload.id in state &&
        action.payload.interfaceName ===
          state[action.payload.id].element.interfaceName
      ) {
        let id = action.payload.id;
        let pointer = state[id];

        while (pointer.parent !== undefined) {
          const childId = id;

          id = pointer.parent;
          pointer = state[id];

          if (!pointer.hasChild(childId)) {
            deleteAllChildElements(state, childId);
            return;
          }
        }

        if (id !== ROOT_ID) {
          delete state[action.payload.id];
        }
      }
    },
    registerParent: (
      state: State,
      action: PayloadAction<{ ids: Id[]; parentId: Id }>
    ) => {
      createNodeIfNotExist(state, action.payload.parentId);

      for (const id of action.payload.ids) {
        if (!state[action.payload.parentId].hasChild(id)) {
          createNodeIfNotExist(state, id);

          state[id].setParent(action.payload.parentId);
          state[action.payload.parentId].addChild(id);
        }
      }
    },
    replaceElement: (
      state: State,
      action: PayloadAction<{
        parentId: Id;
        oldId: Id;
        id: Id;
      }>
    ) => {
      const oldNode = state[action.payload.oldId];
      const parentNode = state[action.payload.parentId];

      if (parentNode === undefined) {
        return;
      }

      const newNode = state[action.payload.id];

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }
      newNode.setParent(parentNode.element.id);

      parentNode.replaceChildElement(
        action.payload.oldId,
        Element.builder()
          .id(newNode.element.id)
          .interfaceName(newNode.element.interfaceName)
          .build()
      );
      parentNode.removeChild(action.payload.oldId);
      parentNode.addChild(newNode.element.id);
    },

    replaceElementInList: (
      state: State,
      action: PayloadAction<{
        oldId: Id;
        ids: Id[];
      }>
    ) => {
      const oldNode = state[action.payload.oldId];
      const parentNode = state[oldNode?.parent];

      if (parentNode === undefined) {
        return;
      }

      const newNodes = action.payload.ids.map((id) => state[id]);

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }

      parentNode.replaceChildElementInList(
        action.payload.oldId,
        newNodes.map((newNode) =>
          Element.builder()
            .id(newNode.element.id)
            .interfaceName(newNode.element.interfaceName)
            .build()
        )
      );

      parentNode.removeChild(action.payload.oldId);

      for (const newNode of newNodes) {
        parentNode.addChild(newNode.element.id);
        newNode.setParent(parentNode.element.id);
      }
    },

    updateStateElement: (
      state: State,
      action: PayloadAction<{
        stateElementId: string;
        patches: Patch[];
      }>
    ) => {
      const element = state[action.payload.stateElementId].element;

      if (!(element instanceof StateHolderElement)) {
        throw new Error("Can only update state of StateHolderElement");
      }

      applyPatches(element.elementState, action.payload.patches);
    },
  },
});

export const reducer = slice.reducer;

export const actions = {
  callEndpoint: createAsyncThunk(
    "CALL_ENDPOINT",
    async (method: Method, { dispatch, getState }) => {
      await engineDispatch(dispatch, [method]);

      return selectors.getState(getState());
    }
  ),
  ...slice.actions,
};
