export interface Video {
  id: string;
  title: string;
  description: string;
  source: {uri: string} | number; // network URI or local require()
  duration: number; // seconds
  thumbnail?: string;
  paywallAt?: number; // seconds — triggers paywall overlay
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  isPaywallShown: boolean;
  isUnlocked: boolean;
}

export const initialPlayerState: VideoPlayerState = {
  isPlaying: false,
  isBuffering: true,
  currentTime: 0,
  duration: 0,
  isLiked: false,
  isPaywallShown: false,
  isUnlocked: false,
};
