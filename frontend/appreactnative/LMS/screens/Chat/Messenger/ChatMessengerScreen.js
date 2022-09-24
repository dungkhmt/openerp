import React, {useEffect} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';

const ChatMessengerScreen = ({route}) => {
  console.log('ChatMessengerScreen: enter');

  useEffect(() => {
    console.log('ChatMessengerScreen.useEffect: enter');
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View />
    </SafeAreaView>
  );
};

export default ChatMessengerScreen;

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
    padding: 8,
    overflow: 'hidden',
  },
});
