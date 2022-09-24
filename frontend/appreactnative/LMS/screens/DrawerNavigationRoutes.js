import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {Colors} from '../styles/index';
import HomeScreen from './DrawerScreens/HomeScreen';
import AccountScreen from './DrawerScreens/AccountScreen';
import SettingsScreen from './DrawerScreens/SettingsScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import StudentQuizTestListScreen from '../screens/Student/StudentQuizTestListScreen';
import StudentQuizTestDetailScreen from '../screens/Student/StudentQuizTestDetailScreen';
import StudentQuizTestQuestionListScreen from '../screens/Student/StudentQuizTestQuestionListScreen';
import StudentRegisterClassScreen from '../screens/Student/StudentRegisterClassScreen';
import StudentClassListScreen from '../screens/Student/StudentClassListScreen';
import StudentClassDetailScreen from '../screens/Student/StudentClassDetailScreen';
import StudentClassChapterListScreen from '../screens/Student/StudentClassChapterListScreen';
import StudentClassChapterDetailScreen from '../screens/Student/StudentClassChapterDetailScreen';
import StudentClassChapterDetailPlayVideoScreen from '../screens/Student/StudentClassChapterDetailPlayVideoScreen';
import StudentClassChapterDetailShowSlideScreen from '../screens/Student/StudentClassChapterDetailShowSlideScreen';
import StudentClassQuizListScreen from '../screens/Student/StudentClassQuizListScreen';
import StudentClassMemberListScreen from '../screens/Student/StudentClassMemberListScreen';
import StudentClassAssignmentListScreen from '../screens/Student/StudentClassAssignmentListScreen';
import StudentClassSessionListScreen from '../screens/Student/StudentClassSessionListScreen';
import StudentClassSessionDetailScreen from '../screens/Student/StudentClassSessionDetailScreen';
import StudentProblemListScreen from '../screens/Student/StudentProblemListScreen';
import StudentIDEScreen from '../screens/Student/StudentIDEScreen';
import StudentRegisteredProgrammingContestScreen from '../screens/Student/StudentRegisteredProgrammingContestScreen';
import StudentNotRegisteredProgrammingContestScreen from '../screens/Student/StudentNotRegisteredProgrammingContestScreen';
import ChatMessengerScreen from './Chat/Messenger/ChatMessengerScreen';
import ChatLiveScreen from './Chat/Live/ChatLiveScreen';
import ChatLiveParticipantListScreen from './Chat/Live/ChatLiveParticipantListScreen';
import ChatLiveDiscussionScreen from './Chat/Live/ChatLiveDiscussionScreen';
import JoinMeetingRoomScreen from './Chat/Live/JoinMeetingRoomScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* Student */}
      <Stack.Screen
        name="StudentRegisterClassScreen"
        component={StudentRegisterClassScreen}
        options={{
          title: 'Đăng ký lớp',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassListScreen"
        component={StudentClassListScreen}
        options={{
          title: 'Danh sách lớp',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassDetailScreen"
        component={StudentClassDetailScreen}
        options={{
          title: 'Chi tiết lớp',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassChapterListScreen"
        component={StudentClassChapterListScreen}
        options={{
          title: 'Nội dung',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassChapterDetailScreen"
        component={StudentClassChapterDetailScreen}
        options={{
          title: 'Material',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassChapterDetailPlayVideoScreen"
        component={StudentClassChapterDetailPlayVideoScreen}
        options={{
          title: 'Video Player',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassChapterDetailShowSlideScreen"
        component={StudentClassChapterDetailShowSlideScreen}
        options={{
          title: 'Presenter',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassQuizListScreen"
        component={StudentClassQuizListScreen}
        options={{
          title: 'Quiz',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassMemberListScreen"
        component={StudentClassMemberListScreen}
        options={{
          title: 'Sinh viên',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassAssignmentListScreen"
        component={StudentClassAssignmentListScreen}
        options={{
          title: 'Bài tập',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassSessionListScreen"
        component={StudentClassSessionListScreen}
        options={{
          title: 'Buổi học',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentClassSessionDetailScreen"
        component={StudentClassSessionDetailScreen}
        options={{
          title: 'Chi tiết buổi học',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentQuizTestListScreen"
        component={StudentQuizTestListScreen}
        options={{
          title: 'Quiz Test',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentQuizTestDetailScreen"
        component={StudentQuizTestDetailScreen}
        options={{
          title: 'Chi tiết Quiz Test',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentQuizTestQuestionListScreen"
        component={StudentQuizTestQuestionListScreen}
        options={{
          title: 'Question List',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentProblemListScreen"
        component={StudentProblemListScreen}
        options={{
          title: 'Problem List',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentIDEScreen"
        component={StudentIDEScreen}
        options={{
          title: 'IDE',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentRegisteredProgrammingContestScreen"
        component={StudentRegisteredProgrammingContestScreen}
        options={{
          title: 'Registered Programming Contest',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="StudentNotRegisteredProgrammingContestScreen"
        component={StudentNotRegisteredProgrammingContestScreen}
        options={{
          title: 'Not Registered Programming Contest',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* Chat */}
      <Stack.Screen
        name="ChatMessengerScreen"
        component={ChatMessengerScreen}
        options={{
          title: 'Chat Messenger',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="ChatLiveScreen"
        component={ChatLiveScreen}
        options={{
          title: 'Chat Live',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="ChatLiveParticipantListScreen"
        component={ChatLiveParticipantListScreen}
        options={{
          title: 'Participant List',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="ChatLiveDiscussionScreen"
        component={ChatLiveDiscussionScreen}
        options={{
          title: 'Discussion',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="JoinMeetingRoomScreen"
        component={JoinMeetingRoomScreen}
        options={{
          title: 'Join Meeting Room',
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AccountScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="AccountScreen">
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: 'Account',
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: Colors.controlBackground,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: Colors.controlBackground,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {color: 'white', fontSize: 16, fontWeight: 'bold'},
      }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="HomeScreenStack"
        options={{drawerLabel: 'Home'}}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="AccountScreenStack"
        options={{drawerLabel: 'Account'}}
        component={AccountScreenStack}
      />
      <Drawer.Screen
        name="SettingsScreenStack"
        options={{drawerLabel: 'Settings'}}
        component={SettingsScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
