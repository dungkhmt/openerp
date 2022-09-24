import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../../styles/index';
import {getInvitedMeetingListAction} from '../../../redux-saga/actions/GetInvitedMeetingListAction';

const Meeting = ({data}) => {
  const navigation = useNavigation();

  const startedDateTime = new Date(data.openIn);
  const endedDateTime = new Date(data.closeIn);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.push('JoinMeetingRoomScreen', {roomId: data.id});
        }}>
        <Text style={styles.meeting}>{data.roomName}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.startedDateTime}>Bắt đầu</Text>
          <Text style={{...styles.startedDateTime, textAlign: 'right'}}>{startedDateTime.toLocaleDateString()} {startedDateTime.toLocaleTimeString()}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.endedDateTime}>Kết thúc</Text>
          <Text style={{...styles.endedDateTime, textAlign: 'right'}}>{endedDateTime.toLocaleDateString()} {endedDateTime.toLocaleTimeString()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ChatLiveInvitedMeetingsScreen = ({route}) => {
  console.log('ChatLiveInvitedMeetingsScreen: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.getInvitedMeetingListReducer.isFetching);
  const meetingList = useSelector(
    state => state.getInvitedMeetingListReducer.invitedMeetingList.content,
  );

  useEffect(() => {
    console.log('ChatLiveInvitedMeetingsScreen.useEffect: enter');
    dispatch(getInvitedMeetingListAction());
  }, []);

  const renderItem = ({item}) => <Meeting data={item} />;

  const refresh = () => {
    console.log('ChatLiveInvitedMeetingsScreen.refresh: enter');
    if (!loading) {
      dispatch(getInvitedMeetingListAction());
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={meetingList}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'meeting_' + item.id + '_' + index}
          onRefresh={refresh}
          refreshing={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatLiveInvitedMeetingsScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    margin: 8,
    overflow: 'hidden',
  },
  meeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.controlBackground,
    padding: 8,
  },
  startedDateTime: {
    fontSize: 13,
    color: Colors.text,
    padding: 8,
  },
  endedDateTime: {
    fontSize: 13,
    color: Colors.text,
    padding: 8,
  },
});
