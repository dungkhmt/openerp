# This is mobile application written in React Native.

## Setup development environment

https://reactnative.dev/docs/environment-setup

## Third Party Libraries

npm install @react-navigation/native \
npm install react-native-screens react-native-safe-area-context \
npm install @react-navigation/stack \
npm install @react-navigation/drawer \
npm install react-native-gesture-handler react-native-reanimated \
npm install react-native-base64 \
npm install @react-native-async-storage/async-storage \
npm install react-native-pager-view \
npm install react-native-photo-zoom \
npm install react-native-render-html \
npm install react-native-snap-carousel \
npm install react-native-video \
npm install axios \
npm install react-redux \
npm install redux-saga \
npm install @react-native-community/checkbox

## iOS

### Run on simulator

1. $npm install
2. $npx pod-install ios
3. $npx react-native start
4. Open a seperate Terminal and run $npx react-native run-ios

### Build debug ipa

1. Open ios/LMS.xcworkspace file by Xcode
2. Configure project's Build settings
3. From Xcode's Product menu, choose Archive

## Android

### Run on Android simulator

1. $npm install
2. $npx react-native start
3. $cd android
4. $./gradlew assembleDebug --warning-mode all
5. Open a seperate Terminal and run $npx react-native run-android

### Build debug apk

1. $mkdir android/app/assets
2. $mkdir android/app/src/main/assets
3. $npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
4. $cd android/
5. $./gradlew assembleDebug
6. $cd app/build/outputs/apk/debug

## Upgrade project

https://reactnative.dev/docs/upgrading

## Troubleshooting

rm -rf node_modules \
rm package-lock.json \
npm install \
npx pod-install ios \
npx react-native start --reset-cache