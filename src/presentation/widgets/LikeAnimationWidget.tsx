import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface HeartInstance {
  id: number;
  x: number;
  y: number;
}

interface LikeAnimationWidgetProps {
  onSingleTap?: () => void;
  onDoubleTap: () => void;
}

/**
 * Manages multiple stacked heart animations at exact tap locations.
 * Spring physics for scale, with fade-out.
 */
export const LikeAnimationWidget: React.FC<LikeAnimationWidgetProps> = ({
  onSingleTap,
  onDoubleTap,
}) => {
  const [hearts, setHearts] = useState<HeartInstance[]>([]);
  const idCounter = useRef(0);
  const lastTapTime = useRef(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        // Double tap detected
        if (singleTapTimer.current) {
          clearTimeout(singleTapTimer.current);
          singleTapTimer.current = null;
        }

        const id = ++idCounter.current;
        setHearts(prev => [...prev, {id, x, y}]);
        onDoubleTap();

        // Trigger haptic if available
        try {
          const ReactNativeHapticFeedback =
            require('react-native-haptic-feedback').default;
          ReactNativeHapticFeedback.trigger('impactMedium', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
        } catch {
          // Haptic not available — silent fail
        }

        // Remove heart after animation completes
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== id));
        }, 1000);
      } else {
        singleTapTimer.current = setTimeout(() => {
          onSingleTap?.();
        }, 300);
      }
      lastTapTime.current = now;
    },
    [onDoubleTap, onSingleTap],
  );

  return (
    <View
      style={StyleSheet.absoluteFill}
      onTouchEnd={e => {
        handleTap(e.nativeEvent.locationX, e.nativeEvent.locationY);
      }}
      pointerEvents="box-only">
      {hearts.map(heart => (
        <HeartAnimation key={heart.id} x={heart.x} y={heart.y} />
      ))}
    </View>
  );
};

/** Individual animated heart at a specific position. */
const HeartAnimation: React.FC<{x: number; y: number}> = ({x, y}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    // Spring scale: 0 → 1.5 → 1
    scale.value = withSequence(
      withSpring(1.5, {damping: 6, stiffness: 200, mass: 0.5}),
      withSpring(1, {damping: 8, stiffness: 150}),
    );

    // Float up slightly
    translateY.value = withTiming(-30, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });

    // Fade out after holding
    opacity.value = withDelay(
      500,
      withTiming(0, {duration: 400, easing: Easing.in(Easing.ease)}),
    );
  }, [scale, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: translateY.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.heart,
        {left: x - 28, top: y - 28},
        animatedStyle,
      ]}>
      ❤️
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    fontSize: 56,
    textShadowColor: 'rgba(255, 0, 80, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 12,
  },
});
