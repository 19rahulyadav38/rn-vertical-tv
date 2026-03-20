import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const {width: SCREEN_W} = Dimensions.get('window');

interface PaywallOverlayProps {
  visible: boolean;
  onUnlock: () => void;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({
  visible,
  onUnlock,
}) => {
  const cardTranslateY = useSharedValue(300);
  const cardOpacity = useSharedValue(0);
  const shimmerX = useSharedValue(-1);

  useEffect(() => {
    if (visible) {
      cardOpacity.value = withTiming(1, {duration: 200});
      cardTranslateY.value = withSpring(0, {
        damping: 8,
        stiffness: 100,
        mass: 1,
      });
      // Repeating shimmer on CTA button
      shimmerX.value = -1;
      shimmerX.value = withDelay(
        500,
        withRepeat(
          withTiming(1, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
          -1,
          false,
        ),
      );
    } else {
      cardTranslateY.value = withTiming(300, {duration: 200});
      cardOpacity.value = withTiming(0, {duration: 200});
    }
  }, [visible, cardTranslateY, cardOpacity, shimmerX]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{translateY: cardTranslateY.value}],
    opacity: cardOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: interpolate(shimmerX.value, [-1, 1], [-SCREEN_W, SCREEN_W])},
    ],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
      <TouchableWithoutFeedback>
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={15}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.8)"
          />
          <View style={styles.centerer}>
            <Animated.View style={[styles.card, cardStyle]}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.title}>Episode Locked</Text>
              <Text style={styles.subtitle}>
                Unlock this episode to continue watching
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={onUnlock}
                activeOpacity={0.8}>
                <Text style={styles.ctaText}>Unlock Episode</Text>
                <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(255,255,255,0.15)',
                      'transparent',
                    ]}
                    start={{x: 0, y: 0.5}}
                    end={{x: 1, y: 0.5}}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  centerer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#FF2D55',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
