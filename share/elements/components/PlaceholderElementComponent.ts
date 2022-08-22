import { PlaceholderElement } from "../../domain/interfaces";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function PlaceholderElementComponent(
  props: EngineComponentProps
) {
  const element = useElementData(props.elementId, PlaceholderElement);

  useElementEvent(element);

  return null;
}
