import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RTCView, mediaDevices} from 'react-native-webrtc';
import Peer from 'react-native-peerjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../../styles/index';
import {getMeetingParticipantListAction} from '../../../redux-saga/actions/GetMeetingParticipantListAction';

/*
const PEER_SERVER = {
  secure: true,
  host: 'openerp-peerjs-server.herokuapp.com',
  port: 443,
  path: '/',
  key: 'peerjs',
};
*/

const PEER_SERVER = {
  secure: true,
  host: 'openerp.dailyopt.ai',
  port: 443,
  path: '/api/video-call/peer-server',
  key: 'peerjs',
};

const {width, height} = Dimensions.get('window');

const JoinMeetingRoomScreen = ({route}) => {
  console.log('JoinMeetingRoomScreen: enter');

  const navigation = useNavigation();
  const {roomId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  var meetingParticipantList = useSelector(
    state => state.getMeetingParticipantListReducer.meetingParticipantList,
  );

  const [localPeer] = useState(() => new Peer(undefined, PEER_SERVER));
  const [localStream, setLocalStream] = useState();
  const [loginUserId, setLoginUserId] = useState();
  const [readyForConference, setReadyForConference] = useState(false);
  const [remoteStreamInformation, setRemoteStreamInformation] = useState();
  const [participantList, setParticipantList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);

  if (participantList) {
    console.log(JSON.stringify(participantList));
  }

  // This code block is execute when component is mounted
  useEffect(() => {
    console.log('JoinMeetingRoomScreen.useEffect: enter');

    AsyncStorage.getItem('user_id').then(value => {
      console.log('JoinMeetingRoomScreen: loginUserId = ' + value);
      setLoginUserId(value);
    });

    localPeer.on('open', localPeerId => {
      console.log('Local peer open with ID', localPeerId);

      let isFront = true;
      mediaDevices.enumerateDevices().then(sourceDevices => {
        let videoSourceId;
        for (let i = 0; i < sourceDevices.length; i++) {
          const sourceDevice = sourceDevices[i];
          if (
            sourceDevice.kind == 'videoinput' &&
            sourceDevice.facing == (isFront ? 'front' : 'environment')
          ) {
            videoSourceId = sourceDevice.deviceId;
          }
        }
        mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              mandatory: {
                minFrameRate: 30,
              },
              facingMode: isFront ? 'user' : 'environment',
              optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
          })
          .then(stream => {
            console.log('Get local stream successfully.');
            setLocalStream(stream);
            setReadyForConference(true);
          })
          .catch(error => {
            console.log(error);
          });
      });
    });

    localPeer.on('call', call => {
      console.log('JoinMeetingRoomScreen: on call');
      call.answer(localStream);
      call.on('stream', remoteStream => {
        console.log('JoinMeetingRoomScreen: on receive remote stream');
        setRemoteStreamInformation({call, remoteStream});
      });
    });

    return () => {
      // This code block is execute when component is unmounted
      console.log('JoinMeetingRoomScreen: exit');
      if (localPeer) {
        console.log('JoinMeetingRoomScreen: destroy local peer');
        localPeer.destroy();
      }
    };
  }, []);

  // This code block is execute when readyForConference is changed
  useEffect(() => {
    console.log('Is ready for conference? ' + readyForConference);
    if (readyForConference) {
      dispatch(getMeetingParticipantListAction({roomId: roomId}));
    }
  }, [readyForConference]);

  // This code block is execute when meetingParticipantList is changed
  useEffect(() => {
    console.log('meetingParticipantList has been changed');

    if (loginUserId !== undefined && meetingParticipantList !== undefined) {
      meetingParticipantList.forEach(participant => {
        setParticipantList(meetingParticipantList);

        if (participant.participantId !== loginUserId) {
          console.log('calling ' + participant.participantId);
          const call = localPeer.call(participant.peerId, localStream);
          call.on('stream', remoteStream => {
            console.log('JoinMeetingRoomScreen: on receive remote stream');
            setRemoteStreamInformation({call, remoteStream});
          });
        }
      });
    }
  }, [meetingParticipantList]);

  // This code block is execute when remoteStreamInformation is changed
  useEffect(() => {
    console.log('remoteStreamInformation has been changed');

    if (meetingParticipantList && remoteStreamInformation) {
      const {call, remoteStream} = remoteStreamInformation;
      meetingParticipantList = meetingParticipantList.map(participant => {
        if (participant.peerId === call.peer) {
          return {...participant, remoteStream};
        }
        return participant;
      });
      setParticipantList(meetingParticipantList);
      setUpdate(true);
    }
  }, [remoteStreamInformation]);

  const handleMicrophoneClick = () => {
    setMicrophone(!microphone);
  };

  const handleCameraClick = () => {
    setCamera(!camera);
  };

  const handleParticipantsClick = () => {
    navigation.push('ChatLiveParticipantListScreen', {participantList: meetingParticipantList});
  };

  const handleDiscussionClick = () => {
    navigation.push('ChatLiveDiscussionScreen', {participantList: meetingParticipantList});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 0.7,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {localStream ? (
            <RTCView
              streamURL={localStream.toURL()}
              style={{
                width: width * 0.9 - 8,
                height: 200,
              }}
            />
          ) : null}
        </View>
        <ScrollView
          horizontal
          style={{flex: 0.8}}
          showsHorizontalScrollIndicator={false}>
          <>
            {participantList ? (
              participantList.length > 0 ? (
                <>
                  {participantList.map((participant, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: width * 0.9,
                          marginHorizontal: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <>
                          {(participant.remoteStream !== undefined && participant.remoteStream) ? (
                            <RTCView
                              streamURL={participant.remoteStream.toURL()}
                              style={{
                                width: width * 0.9 - 8,
                                height: 300,
                              }}
                            />
                          ) : (
                            <View
                              style={{...styles.participantContainer,
                                width: width * 0.9 - 8,
                                height: 300,
                              }}
                            >
                              <Text style={styles.participant}>{participant.participantId}</Text>
                            </View>
                          )}
                        </>
                      </View>
                    );
                  })}
                </>
              ) : null
            ) : null}
          </>
        </ScrollView>
        <View
          style={{
            flex: 0.2,
          }}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: Colors.controlBackground}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleMicrophoneClick}>
              <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={microphone ? require('../../../assets/images/unmuted.png') : require('../../../assets/images/muted.png')} style={{width: 32, height: 32}}></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleCameraClick}>
              <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={camera ? require('../../../assets/images/video.png') : require('../../../assets/images/no-video.png')} style={{width: 32, height: 32}}></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleParticipantsClick}>
              <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../../assets/images/participants.png')} style={{width: 32, height: 32}}></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleDiscussionClick}>
              <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../../assets/images/discussion.png')} style={{width: 32, height: 32}}></Image>
              </View>
            </TouchableOpacity>
            <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={require('../../../assets/images/share.png')} style={{width: 32, height: 32}}></Image>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JoinMeetingRoomScreen;

const styles = StyleSheet.create({
  participantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.containerBackground,
  },
  participant: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.controlBackground,
    alignContent: 'center',
    padding: 8,
  },
});
