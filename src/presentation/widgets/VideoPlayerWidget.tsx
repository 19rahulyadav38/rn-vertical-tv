import React, {useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Video from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {Video as VideoModel} from '../../domain/models/Video';
import {useVideoPlayer} from '../hooks/useVideoPlayer';
import {LikeAnimationWidget} from './LikeAnimationWidget';
import {ScrubberWidget} from './ScrubberWidget';
import {PaywallOverlay} from './PaywallOverlay';
import {VideoInfoOverlay} from './VideoInfoOverlay';
import {SkeletonLoader} from './SkeletonLoader';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');

interface VideoPlayerWidgetProps {
  video: VideoModel;
  isActive: boolean;
}

export const VideoPlayerWidget: React.FC<VideoPlayerWidgetProps> = ({
  video,
  isActive,
}) => {
  const insets = useSafeAreaInsets();
  const {
    videoRef,
    state,
    onLoad,
    onProgress,
    onBuffer,
    togglePlay,
    seekTo,
    toggleLike,
    like,
    unlock,
    pause,
    play,
  } = useVideoPlayer(video);

  // Play/pause based on visibility
  useEffect(() => {
    if (isActive) {
      play();
    } else {
      pause();
    }
  }, [isActive, play, pause]);

  const showSkeleton = state.isBuffering && state.currentTime === 0;

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={video.source}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={!state.isPlaying}
        onLoad={(data: any) => onLoad({duration: data.duration})}
        onProgress={(data: any) => onProgress({currentTime: data.currentTime})}
        onBuffer={(data: any) => onBuffer({isBuffering: data.isBuffering})}
      />

      {showSkeleton && <SkeletonLoader />}

      <LikeAnimationWidget onSingleTap={togglePlay} onDoubleTap={like} />

      <VideoInfoOverlay
        title={video.title}
        description={video.description}
        isLiked={state.isLiked}
        onToggleLike={toggleLike}
        bottomInset={insets.bottom}
      />

      <ScrubberWidget
        currentTime={state.currentTime}
        duration={state.duration}
        onSeek={seekTo}
        bottomInset={insets.bottom}
      />

      <PaywallOverlay
        visible={state.isPaywallShown}
        onUnlock={unlock}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: '#000',
  },
  video: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
});
