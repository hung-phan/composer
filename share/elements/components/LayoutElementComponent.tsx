import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { LayoutElement } from "./widgets";

export default function LayoutElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, LayoutElement);

  useElementEvent(element);

  return (
    <div key={element.id}>
      {element.elements.map((widget) =>
        renderElementInterface(widget, element)
      )}
    </div>
  );
}
