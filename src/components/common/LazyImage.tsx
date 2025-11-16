/**
 * LazyImage Component
 * 
 * Optimized image component with lazy loading and placeholder support
 */

import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageProps,
  ImageSourcePropType,
} from 'react-native';
import { colors } from '../../constants/theme';

export interface LazyImageProps extends Omit<ImageProps, 'source'> {
  source: ImageSourcePropType;
  placeholder?: ImageSourcePropType;
  showLoader?: boolean;
  loaderColor?: string;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  placeholder,
  showLoader = true,
  loaderColor = colors.primary.main,
  onLoadStart,
  onLoadEnd,
  onError,
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Reset state when source changes
    setLoading(true);
    setError(false);
    setImageLoaded(false);
  }, [source]);

  const handleLoadStart = () => {
    setLoading(true);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setLoading(false);
    setImageLoaded(true);
    onLoadEnd?.();
  };

  const handleError = (e: any) => {
    setLoading(false);
    setError(true);
    onError?.(e);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder or loader */}
      {(loading || error) && (
        <View style={[styles.placeholderContainer, style]}>
          {placeholder && !error ? (
            <Image
              source={placeholder}
              style={[styles.placeholder, style]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderBackground} />
          )}
          {loading && showLoader && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={loaderColor} />
            </View>
          )}
        </View>
      )}

      {/* Actual image */}
      {!error && (
        <Image
          source={source}
          style={[
            styles.image,
            style,
            { opacity: imageLoaded ? 1 : 0 },
          ]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          {...props}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    width: '100%',
    height: '100%',
  },
  placeholderBackground: {
    flex: 1,
    backgroundColor: colors.neutral.gray[100],
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
