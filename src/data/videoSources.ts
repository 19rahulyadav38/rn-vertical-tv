import {Video} from '../domain/models/Video';

/**
 * Video feed data source.
 * Using free MP4 samples for development — replace with your CDN URLs in production.
 */
export const videoFeed: Video[] = [
  {
    id: 'ep-1',
    title: 'The Encounter',
    description: 'Episode 1 — A chance meeting changes everything.',
    source: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    duration: 15,
    paywallAt: 10,
  },
  {
    id: 'ep-2',
    title: 'Betrayal',
    description: 'Episode 2 — Trust is shattered.',
    source: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    duration: 15,
    paywallAt: 10,
  },
  {
    id: 'ep-3',
    title: 'The Revelation',
    description: 'Episode 3 — Secrets come to light.',
    source: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    duration: 60,
    paywallAt: 10,
  },
  {
    id: 'ep-4',
    title: 'Reckoning',
    description: 'Episode 4 — Consequences arrive.',
    source: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    duration: 15,
    paywallAt: 10,
  },
  {
    id: 'ep-5',
    title: 'Redemption',
    description: 'Episode 5 — A second chance.',
    source: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    duration: 12,
    paywallAt: 10,
  },
];
