import { useCallback, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";
import { request } from "../../../../api";
import ChatList from "../components/Meet/ChatList";
import Participant from "../components/Meet/Participant";
import FooterControl from "../components/Meet/FooterControl";
import Main from "../components/Meet/Main";
import { API_URL } from "../../../../config/config";
import { ADMIN_CHAT_TYPE, ADMIN_ID, PEER_SERVER } from "../utils/constant";
import "../styles/meet.css";
import {
  getDisplayMedia,
  getUserMedia,
  stopAndSetMediaStream,
} from "../utils/helpers";
import useGetMediaStream from "../hooks/useGetMediaStream";
import { useHistory } from "react-router";

const SOCKET_URL = API_URL + "/chatSocketHandler";

const Meet = () => {
  const stompClient = useMemo(() => {
    const sock = new window.SockJS(SOCKET_URL);
    const stompClient = window.Stomp.over(sock);
    return stompClient;
  }, []);
  const history = useHistory();
  const location = window.location.pathname.split("/");
  const meetId = location[location.length - 1];
  const [displayBar, setDisplayBar] = useState("chat");
  const [listMsg, setListMsg] = useState([]);
  const [message, setMessage] = useState();
  const [listParticipant, setListPartcipant] = useState([]);
  const [remoteStreamInfo, setRemoteStreamInfo] = useState();
  const [unReadMsg, setUnReadMsg] = useState(0);
  const [micro, setMicro] = useState(false);
  const [camera, setCamera] = useState(false);
  const [name, setName] = useState();
  const [peerId, setPeerId] = useState();
  const [microStream, setMicroStream] = useState();
  const [cameraStream, setCameraStream] = useState();
  const [screenStream, setScreenStream] = useState();
  const [peer] = useState(() => new Peer(undefined, PEER_SERVER));
  const mediaStream = useGetMediaStream([
    microStream,
    cameraStream,
    screenStream,
  ]);

  const sendMessage = useCallback(
    (type, content, url, fileType) => {
      stompClient?.send(
        "/app/chat/" + meetId,
        { "X-Auth-Token": localStorage.getItem("TOKEN") },
        JSON.stringify({ id: name, name, type, content, url, fileType })
      );
    },
    [name, meetId, stompClient]
  );
  const leaveMeet = useCallback(() => {
    sendMessage("leave");
    stompClient.disconnect();
    history.push("/chat/voice/main");
  }, [history, stompClient, sendMessage]);
  const connect = useCallback(() => {
    stompClient.connect(
      {
        "X-Auth-Token": localStorage.getItem("TOKEN"),
      },
      () => {
        stompClient.subscribe("/topic/chat/" + meetId, (message) =>
          setMessage(JSON.parse(message.body))
        );
      }
    );
  }, []);
  const handleClickMicro = async () => {
    try {
      setMicro(!micro);
      if (!micro) {
        const srcMicro = await getUserMedia("micro");
        setMicroStream(srcMicro);
      } else {
        stopAndSetMediaStream(setMicroStream);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleClickCamera = async () => {
    try {
      setCamera(!camera);
      if (!camera) {
        const srcCamera = await getUserMedia("camera");
        setCameraStream(srcCamera);
        stopAndSetMediaStream(setScreenStream);
      } else {
        stopAndSetMediaStream(setCameraStream);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleClickShareScreen = async () => {
    try {
      setCamera(false);
      const srcScreen = await getDisplayMedia();
      setScreenStream(srcScreen);
      stopAndSetMediaStream(setCameraStream);
      if (!!screenStream) {
        try {
          screenStream?.getTracks()?.forEach((track) => track.stop());
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    connect();
    request(
      "get",
      "/room/name",
      (res) => {
        setName(res.data);
        localStorage.setItem("userId", res.data);
      },
      (err) => {
        console.log(err);
      }
    );
    request(
      "get",
      "/roomParticipant/getParticipants?roomId=" + meetId,
      (res) => {
        setListPartcipant(
          res.data.map((participant) => ({
            name: participant.participantId,
            id: participant.participantId,
            peerId: participant.peerId,
          }))
        );
      },
      (err) => {
        console.log(err);
      }
    );

    const onClose = () => {
      stompClient.send(
        "/app/chat/" + meetId,
        {},
        JSON.stringify({ name, type: "leave" })
      );
    };
    window.addEventListener("close", () => {
      onClose();
    });
    return () => {
      window.removeEventListener("close", () => {
        onClose();
      });
    };
  }, []);
  useEffect(() => {
    listParticipant.forEach((participant) => {
      if (participant.peerId !== peerId) {
        peer.call(participant.peerId, mediaStream);
      }
    });
  }, [microStream, cameraStream, screenStream]);
  useEffect(() => {
    let interval;
    if (name) {
      peer?.on("open", (peerId) => {
        setPeerId(peerId);
        interval = setInterval(() => {
          if (stompClient?.connected) {
            sendMessage("join", peerId);
            clearInterval(interval);
          }
        }, 1000);
        peer.on("call", (call) => {
          call.answer();
          call?.on("stream", (remoteStream) => {
            setRemoteStreamInfo({ mediaStream: remoteStream, call });
          });
        });
      });
    }
    return () => {
      clearInterval(interval);
    };
  }, [peer, name, sendMessage, stompClient]);
  useEffect(() => {
    if (message) {
      setListMsg((prevList) => [...prevList, message]);
      if (message.id === ADMIN_ID) {
        const content = JSON.parse(message.content);
        // if join, add this participant to list of participants
        if (content.type === ADMIN_CHAT_TYPE.JOIN) {
          setListPartcipant((prevList) => [
            ...prevList,
            { name: content.name, id: content.id, peerId: content.peerId },
          ]);
          if (mediaStream) {
            peer.call(content.peerId, mediaStream);
          }
        }
        // if leave, delete this participant from list of participants
        if (content.type === ADMIN_CHAT_TYPE.LEAVE) {
          const place = listParticipant.findIndex(
            (participant) => participant.id === content.id
          );
          setListPartcipant((prevList) => [
            ...prevList.slice(0, place),
            ...prevList.slice(place + 1),
          ]);
        }
      }
    }
  }, [message]);
  useEffect(() => {
    if (remoteStreamInfo) {
      const { call, mediaStream } = remoteStreamInfo;
      setListPartcipant((listParticipant) =>
        listParticipant.map((participant) => {
          if (participant?.peerId === call?.peer) {
            return {
              ...participant,
              mediaStream,
            };
          }
          return participant;
        })
      );
    }
  }, [remoteStreamInfo]);

  return (
    <>
      <div className="room">
        <Main
          display={displayBar}
          mediaStream={mediaStream}
          listParticipant={listParticipant}
          typeDisplay="all"
        />
        <ChatList
          display={displayBar}
          setDisplay={setDisplayBar}
          listMsg={listMsg}
          sendMessage={sendMessage}
        />
        <Participant
          meetId={meetId}
          display={displayBar}
          setDisplay={setDisplayBar}
          listParticipant={listParticipant}
        />
      </div>
      <FooterControl
        displayBar={displayBar}
        setDisplayBar={setDisplayBar}
        unReadMsg={unReadMsg}
        camera={camera}
        micro={micro}
        mediaStream={mediaStream}
        meetId={meetId}
        handleClickCamera={handleClickCamera}
        handleClickMicro={handleClickMicro}
        handleClickShareScreen={handleClickShareScreen}
        leaveMeet={leaveMeet}
      />
    </>
  );
};

export default Meet;
