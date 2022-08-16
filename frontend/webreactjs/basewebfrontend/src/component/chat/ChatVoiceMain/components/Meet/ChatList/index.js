import { AiOutlineDoubleRight } from "react-icons/ai";
import classNames from "classnames";
import AdminChat from "./AdminChat";
import InputChat from "./InputChat";
import MyChat from "./MyChat";
import OthersChat from "./OthersChat";
import { ADMIN_ID, BAR_TYPE } from "../../../utils/constant";
import { Backdrop, Box, Fade, Modal } from "@material-ui/core";
import { useState } from "react";

const Chat = (props) => {
  const [displayModalPreview, setDisplayModalPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState();

  const handleCloseModal = () => {
    setDisplayModalPreview(false);
  };
  const previewImage = (imgUrl) => {
    setImagePreview(imgUrl);
    setDisplayModalPreview(true);
  };
  const renderListMsg = () => {
    const userId = localStorage.getItem("userId");
    return props.listMsg.map((msg, index) => {
      const msgId = msg.id;
      return (
        <div key={index}>
          {msgId === ADMIN_ID && <AdminChat data={msg} />}
          {msgId === userId && (
            <MyChat data={msg} previewImage={previewImage} />
          )}
          {msgId !== ADMIN_ID && msg.id !== userId && (
            <OthersChat data={msg} previewImage={previewImage} />
          )}
        </div>
      );
    });
  };
  const closeBar = () => {
    props.setDisplay(BAR_TYPE.NONE);
  };
  return (
    <>
      <div
        className={classNames(
          "room-bar",
          "transition",
          { "display-bar": props.display === BAR_TYPE.CHAT },
          { "hidden-bar": props.display !== BAR_TYPE.CHAT }
        )}
      >
        <div className="close-bar" onClick={closeBar}>
          <AiOutlineDoubleRight />
        </div>
        <div className="title-bar">Trò chuyện</div>
        <div className="content-bar chat-bar-content">
          <div className="list-mess">{renderListMsg()}</div>
          <div className="input-chat">
            <InputChat sendMessage={props.sendMessage} />
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={displayModalPreview}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disablePortal
      >
        <Fade in={displayModalPreview}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "fit-content",
              textAlign: "center",
              p: 4,
            }}
          >
            <img src={imagePreview} alt="" height="80%" width="80%" />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Chat;
