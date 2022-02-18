# This is mobile application written in React Native.

## Setup development environment:

https://reactnative.dev/docs/environment-setup

## iOS

### Run on simulator

1. $npm install
2. $npx pod-install ios
3. $npx react-native start
4. Open a seperate Terminal and run $npx react-native run-ios

### Build debug ipa

TODO:

## Android

### Run on Android simulator

1. $npm install
2. $npx react-native start
3. $cd android
4. $./gradlew bundleRelease --warning-mode all
5. Open a seperate Terminal and run $npx react-native run-android

### Build debug apk

1. $mkdir android/app/assets
2. $npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
3. $cd android/
4. $./gradlew assembleDebug
5. $cd app/build/outputs/apk/
