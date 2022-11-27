import { useSelector } from "react-redux";

import { selectors } from "../domain/engine";
import { DataContainer, Element } from "../domain/interfaces";

export default function useElementState<T extends DataContainer>(
  element: Element
): T | undefined {
  return useSelector((state) =>
    selectors.getElementState(state, element.stateId)
  ) as T;
}
