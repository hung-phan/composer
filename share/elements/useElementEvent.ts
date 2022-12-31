import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { engineDispatch } from "../domain/engine";
import { Element } from "../domain/interfaces";

export default function useElementEvent(element: Element): void {
  const dispatch = useDispatch();

  useEffect(() => {
    if (element) {
      engineDispatch(dispatch, element.onCreate);
    }

    return () => {
      if (element) {
        engineDispatch(dispatch, element.onDestroy);
      }
    };
    // DO NOT modify deps array, it is there to prevent update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
