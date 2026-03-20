import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  clamp,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const SCREEN_W = Dimensions.get('window').width;
const BAR_H_DEFAULT = 3;
const BAR_H_ACTIVE = 6;
const TOOLTIP_W = 100;

interface ScrubberWidgetProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  bottomInset?: number;
}

function formatTime(s: number): string {
  'worklet';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export const ScrubberWidget: React.FC<ScrubberWidgetProps> = ({
  currentTime,
  duration,
  onSeek,
  bottomInset = 0,
}) => {
  const isDragging = useSharedValue(false);
  const dragX = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  const progress = duration > 0 ? currentTime / duration : 0;

  const pan = Gesture.Pan()
    .onBegin(e => {
      isDragging.value = true;
      dragX.value = clamp(e.x, 0, SCREEN_W);
      tooltipOpacity.value = withTiming(1, {duration: 150});
    })
    .onUpdate(e => {
      dragX.value = clamp(e.x, 0, SCREEN_W);
    })
    .onFinalize(() => {
      isDragging.value = false;
      tooltipOpacity.value = withTiming(0, {duration: 200});
      const seekTime = (dragX.value / SCREEN_W) * duration;
      runOnJS(onSeek)(seekTime);
    })
    .hitSlop({top: 20, bottom: 20});

  const barStyle = useAnimatedStyle(() => ({
    height: isDragging.value ? BAR_H_ACTIVE : BAR_H_DEFAULT,
  }));

  const playedStyle = useAnimatedStyle(() => {
    if (isDragging.value) {
      return {width: `${(dragX.value / SCREEN_W) * 100}%` as any};
    }
    return {width: `${progress * 100}%` as any};
  });

  const tooltipStyle = useAnimatedStyle(() => {
    const left = clamp(
      dragX.value - TOOLTIP_W / 2,
      4,
      SCREEN_W - TOOLTIP_W - 4,
    );
    return {
      opacity: tooltipOpacity.value,
      transform: [{translateX: left}],
    };
  });

  const seekTimeText =
    duration > 0
      ? `${formatTime((dragX.value / SCREEN_W) * duration)} / ${formatTime(duration)}`
      : '0:00 / 0:00';

  return (
    <View style={[styles.wrapper, {bottom: bottomInset}]}>
      <Animated.View style={[styles.tooltip, tooltipStyle]}>
        <Text style={styles.tooltipText}>{seekTimeText}</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.bar, barStyle]}>
          <Animated.View style={[styles.played, playedStyle]} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    width: '100%',
    height: BAR_H_DEFAULT,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  played: {
    height: '100%',
    backgroundColor: '#FF2D55',
    borderRadius: 1.5,
  },
  tooltip: {
    position: 'absolute',
    bottom: 16,
    width: TOOLTIP_W,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
