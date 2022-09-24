import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import {Colors} from '../../../styles/index';

const Participant = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}></View>
      <Text style={styles.participant}>{data.participantId}</Text>
    </View>
  );
};

const ChatLiveDiscussionScreen = ({route}) => {
  console.log('ChatLiveDiscussionScreen: enter');

  // Observer results
  const participantList = route.params.participantList;

  useEffect(() => {
    console.log('ChatLiveDiscussionScreen.useEffect: enter');
  }, []);

  const renderItem = ({item}) => <Participant data={item} />;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={participantList}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'participant_' + item.participantId + '_' + index}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatLiveDiscussionScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 8,
    height: 80,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    margin: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 64,
    height: 64,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#12345678',
  },
  participant: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.controlBackground,
    padding: 8,
  },
});
