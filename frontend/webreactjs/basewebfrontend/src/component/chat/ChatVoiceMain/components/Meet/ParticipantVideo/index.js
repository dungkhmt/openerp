import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { ZoomOutMap, ZoomInMap } from "@mui/icons-material";
import { DISPLAY_TYPE } from "component/chat/ChatVoiceMain/utils/constant";

export default function ParticipantVideo({
  data,
  displayType,
  setDisplayType,
  setMediaHighlight,
}) {
  const videoRef = useRef();
  const [displayExtend, setDisplayExtend] = useState(false);

  const handleMouseOver = () => {
    setDisplayExtend(true);
  };
  const handleMouseOut = () => {
    setDisplayExtend(false);
  };
  const zoomIn = () => {
    setDisplayType(DISPLAY_TYPE.HIGHLIGHT);
    setMediaHighlight(data);
  };
  const zoomOut = () => {
    setDisplayType(DISPLAY_TYPE.NORMAL);
  };

  useEffect(() => {
    videoRef.current.srcObject = data?.mediaStream;
  }, [data]);

  return (
    <div
      className={classNames("other-video", { active: displayExtend })}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <video autoPlay controls={false} className="other-video" ref={videoRef} />
      <div className={classNames("extend-part", { active: displayExtend })}>
        <div>{data.id}</div>
        {displayType === DISPLAY_TYPE.HIGHLIGHT && (
          <div className="extend-zoom-icon" onClick={zoomOut}>
            <ZoomInMap />
          </div>
        )}
        {displayType === DISPLAY_TYPE.NORMAL && (
          <div className="extend-zoom-icon" onClick={zoomIn}>
            <ZoomOutMap />
          </div>
        )}
      </div>
    </div>
  );
}
