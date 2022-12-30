import { produceWithPatches } from "immer";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { Input, InputState } from "./widgets";

export default function InputComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Input);

  useElementEvent(element);

  const elementState = useElementState<InputState>(element);
  const dispatch = useDispatch();
  const sendInputOnChange = useCallback(
    (currentValue: string) => {
      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.value = currentValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      engineDispatch(dispatch, element.onInputChange);
    },
    [elementState.value]
  );
  const sendInputOnEnterKeyPress = useCallback(
    (currentValue: string) => {
      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.value = currentValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      engineDispatch(dispatch, element.onEnterKeyPressed);
    },
    [elementState.value]
  );

  return (
    <input
      key={element.id}
      value={elementState.value}
      name={element.name}
      placeholder={element.placeholder}
      onChange={(event) => {
        sendInputOnChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          sendInputOnEnterKeyPress(elementState.value);
        }
      }}
    />
  );
}
