import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { DataElement } from "./widgets";

export default function DataElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, DataElement);

  useElementEvent(element);

  return (
    <span key={element.id} className={element.class}>
      {element.data}
    </span>
  );
}
