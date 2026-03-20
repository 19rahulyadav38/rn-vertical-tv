import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ShimmerEffect} from '../animations/ShimmerEffect';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');

/**
 * Ghost placeholder shown while video is buffering.
 * Mimics the layout of the video card for a seamless transition.
 */
export const SkeletonLoader: React.FC = () => (
  <View style={styles.container}>
    {/* Full-screen background shimmer */}
    <ShimmerEffect width={SCREEN_W} height={SCREEN_H} borderRadius={0} />

    {/* Overlay skeleton elements */}
    <View style={styles.overlay}>
      {/* Title */}
      <ShimmerEffect
        width={SCREEN_W * 0.6}
        height={20}
        borderRadius={4}
        style={styles.title}
      />
      {/* Description line 1 */}
      <ShimmerEffect
        width={SCREEN_W * 0.8}
        height={14}
        borderRadius={4}
        style={styles.desc}
      />
      {/* Description line 2 */}
      <ShimmerEffect
        width={SCREEN_W * 0.5}
        height={14}
        borderRadius={4}
        style={styles.desc}
      />
      {/* Progress bar */}
      <ShimmerEffect
        width={SCREEN_W - 32}
        height={3}
        borderRadius={2}
        style={styles.progress}
      />
    </View>

    {/* Side action buttons */}
    <View style={styles.actions}>
      <ShimmerEffect width={44} height={44} borderRadius={22} />
      <ShimmerEffect
        width={44}
        height={44}
        borderRadius={22}
        style={{marginTop: 20}}
      />
      <ShimmerEffect
        width={44}
        height={44}
        borderRadius={22}
        style={{marginTop: 20}}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: '#0d0d1a',
  },
  overlay: {
    position: 'absolute',
    bottom: 120,
    left: 16,
  },
  title: {marginBottom: 12},
  desc: {marginBottom: 8},
  progress: {marginTop: 20},
  actions: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    alignItems: 'center',
  },
});
