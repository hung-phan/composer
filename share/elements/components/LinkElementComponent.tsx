import Link from "next/link";

import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { LinkElement } from "./widgets";

export default function TextElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, LinkElement);

  useElementEvent(element);

  return (
    <Link href={element.url}>
      <a>{renderElementInterface(element.element, element)}</a>
    </Link>
  );
}
