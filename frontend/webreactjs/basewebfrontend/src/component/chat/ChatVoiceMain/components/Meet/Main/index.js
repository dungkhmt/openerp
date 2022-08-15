import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import ParticipantVideo from "../ParticipantVideo";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { displayHostMedia } from "../../../utils/helpers";
import { BAR_TYPE, DISPLAY_TYPE } from "../../../utils/constant";

const Main = ({ mediaStream, listParticipant, display }) => {
  const hostRef = useRef();
  const [displayType, setDisplayType] = useState(DISPLAY_TYPE.NORMAL);
  const [mediaHightLight, setMediaHighlight] = useState();
  const [hideHostVideo, setHideHostVideo] = useState(false);
  const listParticipantMedia = useMemo(
    () => listParticipant.filter((participant) => !!participant?.mediaStream),
    [listParticipant]
  );
  const renderParticipantMedia = (listParticipantMedia) => {
    return listParticipantMedia.map((participant, index) => (
      <ParticipantVideo
        key={index}
        data={participant}
        displayType={displayType}
        setDisplayType={setDisplayType}
        setMediaHighlight={setMediaHighlight}
      />
    ));
  };
  const changeDisplayHostVideo = () => {
    setHideHostVideo((hideHostVideo) => !hideHostVideo);
  };

  useEffect(() => {
    if (mediaStream) {
      hostRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div
      className={classNames(
        "main-room",
        "transition",
        {
          "mini-main":
            display === BAR_TYPE.CHAT || display === BAR_TYPE.PARTICIPANT,
        },
        { "full-main": display === BAR_TYPE.NONE }
      )}
    >
      <div
        className={classNames(
          `host-video-${displayHostMedia(listParticipantMedia, displayType)}`,
          { hide: hideHostVideo }
        )}
        onClick={changeDisplayHostVideo}
      >
        {(listParticipantMedia?.length > 1 ||
          displayType === DISPLAY_TYPE.HIGHLIGHT) && (
          <div className="control-host-video">
            <KeyboardDoubleArrowLeftIcon />
          </div>
        )}
        <video
          className={classNames("other-video", {
            cover:
              listParticipantMedia?.length > 1 ||
              displayType === DISPLAY_TYPE.HIGHLIGHT,
          })}
          ref={hostRef}
          autoPlay
          muted
        ></video>
      </div>
      {displayType === DISPLAY_TYPE.NORMAL && (
        <div
          className={`other-videos other-videos-${listParticipantMedia.length}`}
        >
          {renderParticipantMedia(listParticipantMedia)}
        </div>
      )}
      {displayType === DISPLAY_TYPE.HIGHLIGHT && (
        <ParticipantVideo
          data={mediaHightLight}
          displayType={displayType}
          setDisplayType={setDisplayType}
          setMediaHighlight={setMediaHighlight}
        />
      )}
    </div>
  );
};

export default Main;
