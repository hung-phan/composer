import { StateHolderElement } from "../../domain/interfaces";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function StateHolderElementComponent(
  props: EngineComponentProps
) {
  const element = useElementData(props.elementId, StateHolderElement);

  useElementEvent(element);

  return null;
}
