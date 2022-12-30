import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Text } from "./widgets";

export default function TextComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Text);

  useElementEvent(element);

  return <span key={element.id}>{element.message}</span>;
}
