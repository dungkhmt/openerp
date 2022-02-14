import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from '../../styles/index';

const TutorialScreen = ({navigation}) => {
  console.log('TutorialScreen: enter');

  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View
        key="1"
        style={{
          flex: 1,
          backgroundColor: Colors.containerBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: Colors.text, fontSize: 36, fontWeight: 'bold'}}>
          1st Tutorial Page
        </Text>
      </View>
      <View
        key="2"
        style={{
          flex: 1,
          backgroundColor: Colors.containerBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: Colors.text, fontSize: 36, fontWeight: 'bold'}}>
          2nd Tutorial Page
        </Text>
      </View>
      <View
        key="3"
        style={{
          flex: 1,
          backgroundColor: Colors.containerBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: Colors.text, fontSize: 36, fontWeight: 'bold'}}>
          3rd Tutorial Page
        </Text>
        <Button
          onPress={() => {
            console.log('START ...');
            AsyncStorage.setItem('show_tutorial', JSON.stringify(true));
            AsyncStorage.getItem('user_id').then(userId =>
              navigation.replace(
                userId === null ? 'Auth' : 'DrawerNavigationRoutes',
              ),
            );
          }}
          title="Start"
        />
      </View>
    </PagerView>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
