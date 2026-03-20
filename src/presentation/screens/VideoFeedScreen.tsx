import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import {videoFeed} from '../../data/videoSources';
import {VideoPlayerWidget} from '../widgets/VideoPlayerWidget';
import type {Video} from '../../domain/models/Video';

const {height: SCREEN_H} = Dimensions.get('window');

export const VideoFeedScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]).current;

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_H,
      offset: SCREEN_H * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({item, index}: {item: Video; index: number}) => (
      <VideoPlayerWidget video={item} isActive={index === activeIndex} />
    ),
    [activeIndex],
  );

  const keyExtractor = useCallback((item: Video) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={videoFeed}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        snapToInterval={SCREEN_H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        windowSize={3}
        maxToRenderPerBatch={2}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
