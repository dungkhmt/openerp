import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const StudentClassChapterDetailPlayVideoScreen = ({route}) => {
  console.log('StudentClassChapterDetailPlayVideoScreen: enter');

  const {sourceId} = route.params;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Video
        source={{
          uri: 'https://openerp.dailyopt.ai/api/videos/videos/' + sourceId,
        }}
        style={styles.videoPlayer}
        repeat={true}
        resizeMode="contain"
        volume={1.0}
        rate={1.0}
        controls
      />
    </SafeAreaView>
  );
};

export default StudentClassChapterDetailPlayVideoScreen;

const styles = StyleSheet.create({
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
