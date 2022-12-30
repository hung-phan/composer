import { useDispatch } from "react-redux";

import { engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { ButtonElement } from "./widgets";

export default function ButtonComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, ButtonElement);

  useElementEvent(element);

  const dispatch = useDispatch();

  return (
    <button
      key={element.id}
      onClick={() => engineDispatch(dispatch, element.onSelected)}
      type={element.type}
    >
      {element.label !== undefined && element.label}
    </button>
  );
}
