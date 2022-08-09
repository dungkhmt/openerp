import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useHistory } from "react-router";
import ScheduleMeet from "./ScheduleMeet";
import ButtonMeetNow from "./ButtonMeetNow";
import ListMeet from "../ListMeet";
import TertiaryButton from "component/button/TertiaryButton";
import PrimaryButton from "component/button/PrimaryButton";
import {
  useDeleteMeet,
  useGetOwnedMeets,
  useUpdateMeet,
} from "../../hooks/chatVoiceHome";
import { styleModal } from "../../utils/constant";
import InviteFriend from "../InviteFriend";
import { useGetInvitedFriends } from "../../hooks/meet";
import ModalMeet from "./Modal/ModalMeet";
import ModalUpdateMeet from "./Modal/ModalUpdateMeet";

export default function Host() {
  const [displayModal, setDisplayModal] = useState(false);
  const [displayModalUpdate, setDisplayModalUpdate] = useState(false);
  const [modalContentData, setModalContentData] = useState();
  const { data: ownedMeets, refetch } = useGetOwnedMeets({ params: null });
  const { data: invitedFriends } = useGetInvitedFriends({
    meetId: modalContentData?.meetId,
  });
  const { mutateAsync: mutateDelete } = useDeleteMeet({});
  const { mutateAsync: mutateUpdate } = useUpdateMeet({});
  const history = useHistory();
  const listMeet = ownedMeets?.content.map((meet) => ({
    id: meet[0],
    roomName: meet[1],
    openIn: meet[2],
    closeIn: meet[3],
  }));

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    if (reason === "escapeKeyDown") {
      return;
    }
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
  const openModalUpdate = () => {
    setDisplayModal(false);
    setDisplayModalUpdate(true);
  };
  const updateMeet = async (params) => {
    await mutateUpdate(params);
    handleCloseModalUpdate();
    setModalContentData({
      ...params,
      meetId: params?.id,
      name: params?.roomName,
    });
    refetch();
  };
  const handleCloseModalUpdate = () => {
    setDisplayModalUpdate(false);
    setDisplayModal(true);
  };

  const renderModalContent = useMemo(() => {
    const { name, meetId } = modalContentData || {};
    const deleteMeet = async (meetId) => {
      await mutateDelete({ id: meetId });
      refetch();
      setDisplayModal(false);
    };

    return (
      <Box sx={styleModal} className="host-modal">
        <h2 className="host-modal-title">{name}</h2>
        <div className="host-modal-invited-friends-title">
          Danh sách người được mới
        </div>
        <Grid
          className="host-modal-invited-friends"
          container
          spacing={2}
          style={{ width: "100%" }}
        >
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
        <Accordion className="host-model-extend">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Mở rộng</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <PrimaryButton
                  className="delete"
                  onClick={() => deleteMeet(meetId)}
                >
                  Xóa
                </PrimaryButton>
              </Grid>
              <Grid item xs={6}>
                <PrimaryButton onClick={openModalUpdate}>
                  Cập nhật thông tin
                </PrimaryButton>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
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
  }, [modalContentData, invitedFriends, joinMeet, mutateDelete, refetch]);

  return (
    <>
      <ScheduleMeet refetchOwnedMeets={refetch} />
      <ListMeet
        title="Danh sách cuộc họp của bạn"
        listMeet={listMeet || []}
        onClickMeet={handleClickMeet}
      />
      <ButtonMeetNow />
      <ModalMeet visible={displayModal} onClose={handleClose}>
        {renderModalContent}
      </ModalMeet>
      <ModalUpdateMeet
        {...modalContentData}
        updateMeet={updateMeet}
        visible={displayModalUpdate}
        onClose={handleCloseModalUpdate}
      />
    </>
  );
}
