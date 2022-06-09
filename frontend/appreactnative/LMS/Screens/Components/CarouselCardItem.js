import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {Colors} from '../../styles/index';

export const SLIDER_WIDTH = Dimensions.get('window').width + 64;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);

const CarouselCardItem = ({item, index}) => {
  return (
    <View style={styles.container} key={index}>
      <TouchableOpacity
        onPress={() => {
          Linking.canOpenURL(item.link).then(supported => {
            if (supported) {
              Linking.openURL(item.link);
            } else {
              console.log("Don't know how to open URI: " + item.link);
            }
          });
        }}>
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.controlBackground,
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  header: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingTop: 16,
  },
  body: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default CarouselCardItem;
