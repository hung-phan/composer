import { produceWithPatches } from "immer";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { SelectElement, SelectElementState } from "./widgets";

export default function SelectElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, SelectElement);

  useElementEvent(element);

  const elementState = useElementState<SelectElementState>(element);
  const dispatch = useDispatch();
  const [value, setValue] = useState(element.defaultValue);
  const handleItemSelect = useCallback(
    (itemValue: string) => {
      if (itemValue === value) {
        return;
      }

      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.value = itemValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      engineDispatch(dispatch, element.onItemSelected);

      setValue(itemValue);
    },
    [setValue]
  );

  return (
    <div
      key={element.id}
      className={`flex justify-center items-center ${
        element.class || ""
      }`.trim()}
    >
      <select value={value} onChange={(e) => handleItemSelect(e.toString())}>
        {_.zip(element.itemValues, element.itemDescriptions).map(
          ([itemValue, itemDescription], index) => (
            <option key={index} value={itemValue}>
              {itemDescription}
            </option>
          )
        )}
      </select>
    </div>
  );
}
