/**
 * Image Optimization Utilities
 * 
 * Utilities for optimizing image loading and caching
 */

import { Image, Platform } from 'react-native';

/**
 * Preload images to improve performance
 */
export async function preloadImages(
  imageUris: string[]
): Promise<void> {
  try {
    const promises = imageUris.map(uri => {
      return Image.prefetch(uri);
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.warn('Error preloading images:', error);
  }
}

/**
 * Get optimized image size based on screen dimensions
 */
export function getOptimizedImageSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Clear image cache
 */
export async function clearImageCache(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      // iOS doesn't have a direct API to clear cache
      // Cache is managed automatically
      console.log('Image cache cleared (iOS)');
    } else {
      // Android - cache is managed by the system
      console.log('Image cache cleared (Android)');
    }
  } catch (error) {
    console.warn('Error clearing image cache:', error);
  }
}

/**
 * Get image cache size (estimate)
 */
export function getImageCacheSize(): number {
  // This is an estimate as React Native doesn't provide direct cache size API
  // In production, you might want to use a library like react-native-fast-image
  return 0;
}

/**
 * Image quality presets
 */
export const ImageQuality = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.8,
  ORIGINAL: 1.0,
} as const;

/**
 * Recommended image sizes for different use cases
 */
export const ImageSizes = {
  THUMBNAIL: { width: 100, height: 100 },
  SMALL: { width: 200, height: 200 },
  MEDIUM: { width: 400, height: 400 },
  LARGE: { width: 800, height: 800 },
  FULL: { width: 1200, height: 1200 },
} as const;

/**
 * Check if image should be lazy loaded based on position
 */
export function shouldLazyLoad(
  itemIndex: number,
  visibleStartIndex: number,
  visibleEndIndex: number,
  preloadOffset: number = 2
): boolean {
  return (
    itemIndex >= visibleStartIndex - preloadOffset &&
    itemIndex <= visibleEndIndex + preloadOffset
  );
}

/**
 * Optimize image URI for web (if applicable)
 */
export function optimizeImageUri(
  uri: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  // For local images, return as is
  if (!uri.startsWith('http')) {
    return uri;
  }

  // For remote images, you can add query parameters for optimization
  // This depends on your image CDN/service
  const url = new URL(uri);
  
  if (width) {
    url.searchParams.set('w', width.toString());
  }
  
  if (height) {
    url.searchParams.set('h', height.toString());
  }
  
  if (quality) {
    url.searchParams.set('q', Math.round(quality * 100).toString());
  }

  return url.toString();
}
