/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';

import AxiosService from '../services/AxiosService';
import {Colors} from '../styles/index';
import Loader from './Components/Loader';

const LoginScreen = ({navigation}) => {
  console.log('LoginScreen: enter');

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');

    if (!userEmail) {
      Alert.alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      Alert.alert('Please fill Password');
      return;
    }

    setLoading(true);

    let headers = new Headers();
    headers.set(
      'Authorization',
      'Basic ' + base64.encode(userEmail + ':' + userPassword),
    );

    // Clear user information
    AsyncStorage.setItem('user_id', '');
    AsyncStorage.setItem('user_token', '');

    // Call login API
    fetch('https://openerp.dailyopt.ai/api/', {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        // console.log(response);

        setLoading(false);

        if (response && response.headers) {
          let authenticationToken = response.headers.get('x-auth-token');
          if (authenticationToken !== null && authenticationToken.length > 0) {
            AsyncStorage.setItem('user_id', userEmail.trim());
            AsyncStorage.setItem('user_token', authenticationToken);
            AxiosService.setToken(authenticationToken);
            navigation.replace('DrawerNavigationRoutes');
          } else {
            console.error('Cannot get authentication token.');
          }
        }
      })
      .catch(error => {
        setLoading(false);

        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                placeholder="Enter Email"
                placeholderTextColor={Colors.border}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                placeholder="Enter Password"
                placeholderTextColor={Colors.border}
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity>
            {/* // Temporary disable Register function
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.replace('RegisterScreen')}>
              Don't have account? Register
            </Text>
            */}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.containerBackground,
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 48,
    marginHorizontal: 48,
    marginVertical: 12,
  },
  buttonStyle: {
    backgroundColor: Colors.controlBackground,
    borderWidth: 0,
    color: Colors.text,
    borderColor: Colors.border,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginHorizontal: 48,
    marginVertical: 12,
  },
  buttonTextStyle: {
    color: '#ffffff',
    paddingVertical: 8,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: Colors.text,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: Colors.border,
  },
  registerTextStyle: {
    color: Colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 8,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});
