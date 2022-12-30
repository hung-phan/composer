import {
  Draft,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Patch,
  applyPatches,
  enableMapSet,
  enablePatches,
  setAutoFreeze,
} from "immer";
import _ from "lodash";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Id } from "share/library/idGenerator";

import { Template } from "../../elements/templateComponents/templates";
import { RootState } from "../../store";
import { DataContainer, Element, Method, Node } from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { getSimplifiedElement } from "./coreEngineHelpers";
import { GLOBAL_OWNER_ID, ROOT_ID } from "./index";

enableMapSet();
enablePatches();
setAutoFreeze(false);

export type State = {
  [key: Id]: Node;
};

export const mountPoint = "templateEngine";

export const selectors = {
  getState: (state: RootState): State => state[mountPoint],
  getCurrentTemplateOwnerId: (state: RootState): Id => {
    const node: Node = state[mountPoint][ROOT_ID];

    if (node === undefined) {
      return GLOBAL_OWNER_ID;
    }

    const element = node.element;

    if (!(element instanceof Template)) {
      return element.id;
    }

    return element.ownerId;
  },
  getElement: (state: RootState, id: Id): Element | undefined => {
    const node: Node = state[mountPoint][id];

    if (node === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    return node.element;
  },
  getParentElement: (state: RootState, id: Id): Element | undefined => {
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
  getElementState: <T extends DataContainer>(
    state: RootState,
    id: Id
  ): T | undefined => {
    const element = selectors.getElement(state, id);

    if (!(element instanceof DataContainer)) {
      throw new Error("Current element is not a DataContainer");
    }

    return element as T;
  },
};

function deleteAllChildElements(state: State, id: Id): void {
  const childs = state[id]?.childs;

  if (childs === undefined) {
    return;
  }

  for (const child of Object.keys(childs)) {
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
    handleCoreEngineActions: (state, action: PayloadAction<AnyAction[]>) => {
      for (const coreEngineAction of action.payload) {
        slice.caseReducers[_.last(coreEngineAction.type.split("/")) as string](
          state,
          coreEngineAction
        );
      }
    },
    setElement: (
      state: Draft<State>,
      action: PayloadAction<{ element: Element; childIds: Set<Id> }>
    ) => {
      const { element, childIds } = action.payload;

      createNodeIfNotExist(state, element.id);

      state[element.id].element = element;

      const parentNode = state[state[element.id]?.parent];

      if (parentNode) {
        // do inplace update and convert the current child interface to element interface
        parentNode.replaceChildElement(
          element.id,
          getSimplifiedElement(element)
        );
      }

      // remove previous childs
      if (state[element.id].childs !== undefined) {
        for (const childId of Object.keys(state[element.id].childs)) {
          if (!childIds.has(childId)) {
            state[element.id].removeChild(childId);
            delete state[childId];
          }
        }
      }

      // register parent-child relationship
      for (const childId of childIds) {
        createNodeIfNotExist(state, childId);

        state[childId].setParent(element.id);
        state[element.id].addChild(childId);
      }
    },
    delElement: (
      state: Draft<State>,
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
    replaceElement: (
      state: Draft<State>,
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
        getSimplifiedElement(newNode.element)
      );
      parentNode.removeChild(action.payload.oldId);
      parentNode.addChild(newNode.element.id);
    },

    replaceElementInList: (
      state: Draft<State>,
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
        newNodes.map((newNode) => getSimplifiedElement(newNode.element))
      );

      parentNode.removeChild(action.payload.oldId);

      for (const newNode of newNodes) {
        parentNode.addChild(newNode.element.id);
        newNode.setParent(parentNode.element.id);
      }
    },

    updateStateElement: (
      state: Draft<State>,
      action: PayloadAction<{
        stateElementId: string;
        patches: Patch[];
      }>
    ) => {
      const element = state[action.payload.stateElementId].element;

      if (!(element instanceof DataContainer)) {
        throw new Error("Can only update state of DataContainer");
      }

      applyPatches(element, action.payload.patches);
    },
  },
});

export const reducer = slice.reducer;

export const actions = {
  callEndpoint: createAsyncThunk<
    State,
    Method,
    { dispatch: ThunkDispatch<RootState, unknown, AnyAction>; state: RootState }
  >("CALL_ENDPOINT", async (method: Method, thunkAPI) => {
    await engineDispatch(thunkAPI.dispatch, [method]);

    return selectors.getState(thunkAPI.getState());
  }),
  ...slice.actions,
};
