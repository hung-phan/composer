import NextLink from "next/link";

import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Link } from "./widgets";

export default function LinkComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Link);

  useElementEvent(element);

  return (
    <NextLink href={element.url}>
      <a>{renderElementInterface(element.element, element)}</a>
    </NextLink>
  );
}
