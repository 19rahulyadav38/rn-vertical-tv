import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {VideoFeedScreen} from './src/presentation/screens/VideoFeedScreen';

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1, backgroundColor: '#000'}}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <VideoFeedScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
