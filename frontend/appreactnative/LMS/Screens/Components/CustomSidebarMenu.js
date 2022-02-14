import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import {Colors} from '../../styles/index';

const CustomSidebarMenu = props => {
  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Text style={{fontSize: 24, color: Colors.text}}>
            {'LMS'.charAt(0)}
          </Text>
        </View>
        <Text style={stylesSidebar.profileHeaderText}>LMS</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.controlBackground,
    paddingTop: 48,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.controlBackground,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.containerBackground,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    padding: 8,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.line,
  },
});
