import {useCallback, useRef, useState} from 'react';
import {VideoPlayerState, initialPlayerState} from '../../domain/models/Video';
import type {Video} from '../../domain/models/Video';
import type {VideoRef} from 'react-native-video';

/**
 * Core hook encapsulating all video player logic.
 * Uses refs for values read inside callbacks to avoid stale closures.
 */
export function useVideoPlayer(video: Video) {
  const videoRef = useRef<VideoRef>(null);
  const [state, setState] = useState<VideoPlayerState>(initialPlayerState);

  // Refs to avoid stale closures in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  const updateState = useCallback(
    (patch: Partial<VideoPlayerState>) =>
      setState(prev => ({...prev, ...patch})),
    [],
  );

  const onLoad = useCallback(
    (data: {duration: number}) => {
      updateState({duration: data.duration, isBuffering: false});
    },
    [updateState],
  );

  const onProgress = useCallback(
    (data: {currentTime: number}) => {
      const {currentTime} = data;
      updateState({currentTime});

      const {isPaywallShown, isUnlocked} = stateRef.current;
      if (
        video.paywallAt &&
        currentTime >= video.paywallAt &&
        !isPaywallShown &&
        !isUnlocked
      ) {
        videoRef.current?.pause();
        updateState({isPaywallShown: true, isPlaying: false});
      }
    },
    [video.paywallAt, updateState],
  );

  const onBuffer = useCallback(
    (data: {isBuffering: boolean}) => {
      updateState({isBuffering: data.isBuffering});
    },
    [updateState],
  );

  const togglePlay = useCallback(() => {
    const {isPaywallShown, isUnlocked, isPlaying} = stateRef.current;
    if (isPaywallShown && !isUnlocked) {
      return;
    }
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.resume();
    }
    updateState({isPlaying: !isPlaying});
  }, [updateState]);

  const seekTo = useCallback(
    (seconds: number) => {
      videoRef.current?.seek(seconds);
      updateState({currentTime: seconds});
    },
    [updateState],
  );

  const toggleLike = useCallback(() => {
    const {isLiked} = stateRef.current;
    updateState({isLiked: !isLiked});
  }, [updateState]);

  const like = useCallback(() => {
    if (!stateRef.current.isLiked) {
      updateState({isLiked: true});
    }
  }, [updateState]);

  const unlock = useCallback(() => {
    updateState({isUnlocked: true, isPaywallShown: false, isPlaying: true});
    videoRef.current?.resume();
  }, [updateState]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    updateState({isPlaying: false});
  }, [updateState]);

  const play = useCallback(() => {
    const {isPaywallShown, isUnlocked} = stateRef.current;
    if (isPaywallShown && !isUnlocked) {
      return;
    }
    videoRef.current?.resume();
    updateState({isPlaying: true});
  }, [updateState]);

  return {
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
  };
}
