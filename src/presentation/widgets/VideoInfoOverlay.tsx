import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

interface VideoInfoOverlayProps {
  title: string;
  description: string;
  isLiked: boolean;
  onToggleLike: () => void;
  bottomInset?: number;
}

export const VideoInfoOverlay: React.FC<VideoInfoOverlayProps> = ({
  title,
  description,
  isLiked,
  onToggleLike,
  bottomInset = 0,
}) => {
  const likeScale = useSharedValue(1);

  const handleLike = () => {
    likeScale.value = withSequence(
      withSpring(1.4, {damping: 4, stiffness: 300}),
      withSpring(1, {damping: 6, stiffness: 200}),
    );
    onToggleLike();
  };

  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: likeScale.value}],
  }));

  return (
    <View style={[styles.container, {bottom: 24 + bottomInset}]} pointerEvents="box-none">
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
          <Animated.Text style={[styles.heart, likeAnimStyle]}>
            {isLiked ? '\u2764\uFE0F' : '\u{1F90D}'}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  actions: {
    alignItems: 'center',
  },
  heart: {
    fontSize: 32,
  },
});
