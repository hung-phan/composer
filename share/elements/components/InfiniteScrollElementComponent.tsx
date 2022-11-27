import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import { engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { InfiniteScrollElement, InfiniteScrollElementState } from "./widgets";

export default function InfiniteScrollElementComponent(
  props: EngineComponentProps
) {
  const element = useElementData(props.elementId, InfiniteScrollElement);

  useElementEvent(element);

  const elementState = useElementState<InfiniteScrollElementState>(element);
  const dispatch = useDispatch();

  const [isPageLoading, setIsPageLoading] = useState<boolean>();
  const loadMore = useCallback(async () => {
    if (isPageLoading) {
      return;
    }

    setIsPageLoading(true);

    try {
      await engineDispatch(dispatch, element.loadMore);
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  const isItemLoaded = (index) =>
    !elementState.hasMore || index < elementState.items.length;

  const itemCount = (elementState.hasMore ? 1 : 0) + elementState.items.length;

  const Item = ({ index }) => {
    return (
      <div>
        {isItemLoaded(index)
          ? renderElementInterface(elementState.items[index], element)
          : renderElementInterface(element.loader, element)}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={150}
          itemSize={35}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
