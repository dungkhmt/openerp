import { useCallback, useMemo, useState } from "react";
import { Backdrop, Box, Button, Fade, Grid, Modal } from "@material-ui/core";
import ScheduleMeet from "./ScheduleMeet";
import ButtonMeetNow from "./ButtonMeetNow";
import ListMeet from "../ListMeet";
import { useGetOwnedMeets } from "../../hooks/chatVoiceHome";
import { styleModal } from "../../ultis/constant";
import TertiaryButton from "component/button/TertiaryButton";
import PrimaryButton from "component/button/PrimaryButton";
import { useHistory } from "react-router";
import InviteFriend from "../InviteFriend";
import { useGetInvitedFriends } from "../../hooks/meet";

export default function Host() {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContentData, setModalContentData] = useState();
  const { data: ownedMeets, refetch } = useGetOwnedMeets({ params: null });
  const { data: invitedFriends } = useGetInvitedFriends({
    meetId: modalContentData?.meetId,
  });
  const history = useHistory();
  const listMeet = ownedMeets?.content.map((meet) => ({
    id: meet[0],
    roomName: meet[1],
    openIn: meet[2],
    closeIn: meet[3],
  }));

  const handleClose = () => {
    setDisplayModal(false);
  };
  const handleClickMeet = (meetInfo) => {
    setModalContentData(meetInfo);
    setDisplayModal(true);
  };
  const joinMeet = useCallback(() => {
    history.push({
      pathname: `/chat/voice/main/${modalContentData.meetId}`,
    });
  }, [history, modalContentData?.meetId]);
  const renderModalContent = useMemo(() => {
    const { name, meetId } = modalContentData || {};
    return (
      <Box sx={styleModal} className="host-modal">
        <h2 className="host-modal-title">{name}</h2>
        <div className="host-modal-invited-friends-title">
          Danh sách người được mới
        </div>
        <Grid className="host-modal-invited-friends" container spacing={2}>
          {invitedFriends?.content?.length === 0 && (
            <Grid className="host-modal-no-invite" item xs={12}>
              Hiện tại chưa có ai được mời
            </Grid>
          )}
          {invitedFriends?.content?.map((friendName, index) => (
            <Grid className="host-modal-invited-friend" key={index} item xs={6}>
              &#9830; {friendName}
            </Grid>
          ))}
        </Grid>
        <InviteFriend meetId={meetId} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TertiaryButton onClick={handleClose}>Đóng</TertiaryButton>
          </Grid>
          <Grid item xs={6}>
            <PrimaryButton onClick={joinMeet}>Tham gia ngay</PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    );
  }, [modalContentData, invitedFriends, joinMeet]);

  return (
    <>
      <ScheduleMeet refetchOwnedMeets={refetch} />
      <ListMeet
        title="Danh sách cuộc họp của bạn"
        listMeet={listMeet || []}
        onClickMeet={handleClickMeet}
      />
      <ButtonMeetNow />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={displayModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={displayModal}>{renderModalContent}</Fade>
      </Modal>
    </>
  );
}
