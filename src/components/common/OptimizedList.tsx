/**
 * OptimizedList Component
 * 
 * Optimized FlatList wrapper with performance enhancements
 */

import React, { memo, useCallback } from 'react';
import {
  FlatList,
  FlatListProps,
  ViewToken,
  StyleSheet,
} from 'react-native';
import { LoadingState } from './LoadingState';

export interface OptimizedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onEndReachedThreshold?: number;
  estimatedItemSize?: number;
}

function OptimizedListComponent<T>(props: OptimizedListProps<T>) {
  const {
    data,
    renderItem,
    keyExtractor,
    loading = false,
    loadingMessage,
    emptyMessage,
    onEndReachedThreshold = 0.5,
    estimatedItemSize = 100,
    ...flatListProps
  } = props;

  // Memoized render item
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return renderItem(item, index);
    },
    [renderItem]
  );

  // Memoized key extractor
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      return `item-${index}`;
    },
    [keyExtractor]
  );

  // Viewability config
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Can be used for analytics or lazy loading images
      // console.log('Viewable items:', viewableItems.length);
    },
    []
  );

  if (loading && data.length === 0) {
    return <LoadingState message={loadingMessage} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={
        estimatedItemSize
          ? (data, index) => ({
              length: estimatedItemSize,
              offset: estimatedItemSize * index,
              index,
            })
          : undefined
      }
      // Viewability
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      // End reached
      onEndReachedThreshold={onEndReachedThreshold}
      // Other props
      {...flatListProps}
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent;
