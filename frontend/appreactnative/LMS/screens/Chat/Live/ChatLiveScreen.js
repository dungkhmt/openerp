import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatLiveMyMeetingsScreen from './ChatLiveMyMeetingsScreen';
import ChatLiveInvitedMeetingsScreen from './ChatLiveInvitedMeetingsScreen';

const BottomTab = createBottomTabNavigator();

const ChatLiveScreen = ({route}) => {
  console.log('ChatLiveScreen: enter');

  return (
    <BottomTab.Navigator screenOptions={{tabBarLabelPosition: "beside-icon", tabBarIconStyle: { display: "none" }}}>
      <BottomTab.Screen name="ChatLiveMyMeetings" component={ChatLiveMyMeetingsScreen} options={{headerShown: false, tabBarLabel: "My Meetings"}} />
      <BottomTab.Screen name="ChatLiveInvitedMeetings" component={ChatLiveInvitedMeetingsScreen} options={{headerShown: false, tabBarLabel: "Invited Meetings"}} />
    </BottomTab.Navigator>
  );
};

export default ChatLiveScreen;
