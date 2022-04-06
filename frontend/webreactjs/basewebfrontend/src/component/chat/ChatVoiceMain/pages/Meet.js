import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { request } from '../../../../api';
import ChatList from '../components/Meet/ChatList';
import Participant from '../components/Meet/Participant';
import FooterControl from '../components/Meet/FooterControl';
import Main from '../components/Meet/Main';
import { API_URL } from "../../../../config/config";
import '../style/meet.css';
import { ADMIN_CHAT_TYPE, ADMIN_ID, PEER_CONFIG } from '../ultis/constant';

const SOCKET_URL = API_URL + "/chatSocketHandler";

const Meet = () => {
    const sock = new window.SockJS(SOCKET_URL);
    const stompClient = window.Stomp.over(sock);
    const location = window.location.pathname.split('/');
    const roomId = location[location.length - 1];
    const [displayBar, setDisplayBar] = useState('chat');
    const [listMsg, setListMsg] = useState([]);
    const [listParticipant, setListPartcipant] = useState([]);
    const [unReadMsg, setUnReadMsg] = useState(0);
    const [micro, setMicro] = useState(false);
    const [camera, setCamera] = useState(false);
    const [name, setName] = useState();
    const [peerId, setPeerId] = useState();
    const [mediaStream, setMediaStream] = useState();
    const [message, setMessage] = useState();

    // get userLoginId, list of participants in this room 
    useEffect(() => {
        connect();
        request('get', '/room/name', res => {
            setName(res.data);
        }, err => {
            console.log(err);
        });
        request('get', '/roomParticipant/getParticipants?roomId=' + roomId, res => {
            setListPartcipant(res.data.map(participant => ({ name: participant.participantId, id: participant.participantId, peerId: participant.peerId })));
        }, err => {
            console.log(err)
        })
    }, []);

    // if user open camera, mic or share screen, call to every participant in this room
    useEffect(() => {
        if (mediaStream) {
            listParticipant.forEach(participant => {
                if (participant.peerId !== peerId) {
                    peer.call(participant.peerId, mediaStream);
                }
            });
        }
    }, [mediaStream]);

    const connect = () => {
        stompClient.connect({
            'X-Auth-Token': localStorage.getItem('TOKEN'),
        }, () => {
            stompClient.subscribe('/topic/chat/' + roomId, (message) => handleMessage(JSON.parse(message.body)));
        });
    }

    sock.onclose = () => {
        stompClient.send("/app/chat/" + roomId, {}, JSON.stringify({ name, type: 'leave' }));
    }

    // handle messages received from socket
    const handleMessage = (message) => {
        setMessage(message);
        setListMsg(prevList => [...prevList, message]);
    }

    useEffect(() => {
        if (message) {
            if (message.id === ADMIN_ID) {
                const content = JSON.parse(message.content);
                // if join, add this participant to list of participants
                if (content.type === ADMIN_CHAT_TYPE.JOIN) {
                    setListPartcipant(prevList => [...prevList, { name: content.name, id: content.id, peerId: content.peerId }]);
                    if (mediaStream) {
                        peer.call(content.peerId, mediaStream);
                    }
                }

                // if leave, delete this participant from list of participants
                if (content.type === ADMIN_CHAT_TYPE.LEAVE) {
                    const place = listParticipant.findIndex(participant => participant.id === content.id);
                    setListPartcipant(prevList => [
                        ...prevList.slice(0, place),
                        ...prevList.slice(place + 1),
                    ]);
                }
            }
        }
    }, [mediaStream, message]);

    const [peer] = useState(() =>
        new Peer({ config: PEER_CONFIG })
    );

    useEffect(() => {
        if (name) {
            // Peer connect
            peer?.on("open", (peerId) => {

                setPeerId(peerId);

                // send message join room to socket
                sendMessage('join', peerId);

                // Answer
                peer.on("call", (call) => {
                    call.answer();
                    call?.on("stream", remoteStream => {
                        guestVideoRef.current.srcObject = remoteStream;
                    });
                });
            });
        }
    }, [peer, name]);

    const sendMessage = (type, content) => {
        stompClient.send(
            '/app/chat/' + roomId, {
            'X-Auth-Token': localStorage.getItem('TOKEN'),
        }, JSON.stringify({ id: '111', name, type, content })
        );
    }

    return (
        <div className='room'>
            <Main
                display={displayBar}
                mediaStream={mediaStream}
                listParticipant={listParticipant}
                typeDisplay='all'
            />
            <ChatList
                display={displayBar}
                setDisplay={setDisplayBar}
                listMsg={listMsg}
                sendMessage={sendMessage}
            />
            <Participant display={displayBar} setDisplay={setDisplayBar} listParticipant={listParticipant} />
            <FooterControl
                displayBar={displayBar}
                setDisplayBar={setDisplayBar}
                unReadMsg={unReadMsg}
                stompClient={stompClient}
                sendMessage={sendMessage}
                camera={camera}
                micro={micro}
                setCamera={setCamera}
                setMicro={setMicro}
                mediaStream={mediaStream}
                setMediaStream={setMediaStream}
            />
        </div>
    );
}

export default Meet;