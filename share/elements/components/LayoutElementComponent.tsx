import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { LayoutElement } from "./widgets";

export default function LayoutElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, LayoutElement);

  useElementEvent(element);

  const elementClass = getElementClassName(
    element,
    `flex ${element.direction === "horizontal" ? "flex-row" : "flex-col"} gap-6`
  );

  return (
    <div key={element.id} className={elementClass}>
      {element.elements.map((widget) =>
        renderElementInterface(widget, element)
      )}
    </div>
  );
}
