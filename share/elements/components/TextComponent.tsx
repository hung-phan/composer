import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { TextElement } from "./widgets";

export default function TextComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, TextElement);

  useElementEvent(element);

  return <span key={element.id}>{element.message}</span>;
}
