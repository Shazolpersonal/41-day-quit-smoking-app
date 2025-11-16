/**
 * useLazyContent Hook
 * 
 * Hook for lazy loading daily content and other large data
 */

import { useState, useEffect, useCallback } from 'react';

export interface LazyContentOptions {
  preloadCount?: number;
  cacheSize?: number;
}

export function useLazyContent<T>(
  allContent: T[],
  options: LazyContentOptions = {}
) {
  const { preloadCount = 3, cacheSize = 10 } = options;
  
  const [loadedContent, setLoadedContent] = useState<Map<number, T>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Load content for a specific index
   */
  const loadContent = useCallback(
    (index: number) => {
      if (index < 0 || index >= allContent.length) {
        return;
      }

      setLoadedContent((prev) => {
        const newMap = new Map(prev);
        
        // Load current and preload next items
        for (let i = index; i < Math.min(index + preloadCount, allContent.length); i++) {
          if (!newMap.has(i)) {
            newMap.set(i, allContent[i]);
          }
        }

        // Maintain cache size by removing old items
        if (newMap.size > cacheSize) {
          const keysToRemove = Array.from(newMap.keys())
            .filter(key => key < index - preloadCount)
            .slice(0, newMap.size - cacheSize);
          
          keysToRemove.forEach(key => newMap.delete(key));
        }

        return newMap;
      });
    },
    [allContent, preloadCount, cacheSize]
  );

  /**
   * Navigate to specific index
   */
  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= allContent.length) {
        return;
      }

      setLoading(true);
      setCurrentIndex(index);
      loadContent(index);
      
      // Simulate async loading
      setTimeout(() => setLoading(false), 100);
    },
    [allContent.length, loadContent]
  );

  /**
   * Navigate to next item
   */
  const goToNext = useCallback(() => {
    if (currentIndex < allContent.length - 1) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, allContent.length, goToIndex]);

  /**
   * Navigate to previous item
   */
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  /**
   * Get content at specific index
   */
  const getContent = useCallback(
    (index: number): T | undefined => {
      return loadedContent.get(index);
    },
    [loadedContent]
  );

  /**
   * Get current content
   */
  const getCurrentContent = useCallback((): T | undefined => {
    return loadedContent.get(currentIndex);
  }, [loadedContent, currentIndex]);

  /**
   * Preload content on mount
   */
  useEffect(() => {
    loadContent(0);
  }, []);

  return {
    currentIndex,
    currentContent: getCurrentContent(),
    loading,
    goToIndex,
    goToNext,
    goToPrevious,
    getContent,
    hasNext: currentIndex < allContent.length - 1,
    hasPrevious: currentIndex > 0,
    totalCount: allContent.length,
  };
}
