import React, {useEffect} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface ShimmerProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Premium shimmer/skeleton loading effect.
 * Uses a translating gradient to create the shimmer sweep.
 */
export const ShimmerEffect: React.FC<ShimmerProps> = ({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: interpolate(translateX.value, [-1, 1], [-width, width])},
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#1a1a2e',
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
};
