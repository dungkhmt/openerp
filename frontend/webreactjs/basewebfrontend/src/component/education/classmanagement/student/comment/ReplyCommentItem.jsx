import { makeStyles } from "@material-ui/core/styles";
import { authPut, authDelete, authGet, request } from "../../../../../api";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Input,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { errorNoti, successNoti } from "utils/notification";
import displayTime from "utils/DateTimeUtils";

const useStyles = makeStyles((theme) => ({
  commentItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  commentContent: {
    marginLeft: theme.spacing(1),
  },
  commentActionBtn: {
    color: "#bbb",
    fontSize: "10px",
  },
}));

export default function ReplyCommentItem({
  comment,
  flag,
  setFlag,
  loginUser,
}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isEditting, setIsEditting] = useState(false);
  const [commentTextEdit, setCommentTextEdit] = useState(comment.commentText);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const onHandleUpdateComment = () => {
    editComment();
    setIsEditting(false);
  };

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    //close menu edit/delete
    setAnchorEl(null);
    setOpenModal(false);
  };

  const onConfirmDeleteComment = () => {
    deleteComment();
    setAnchorEl(null);
    setOpenModal(false);
  };

  //function with call api
  //edit comment
  const editComment = async () => {
    let body = {
      commentText: commentTextEdit,
    };

    // let edittedComment = await authPut(
    //   dispatch,
    //   token,
    //   `/edit-comment-on-quiz/${comment.commentId}`,
    //   body
    // );
    request(
      // token,
      // history,
      "put",
      `/edit-comment-on-quiz/${comment.commentId}`,
      (res) => {
        if (200 === res.status) {
          successNoti("S???a b??nh lu???n th??nh c??ng", true);
        }
      },
      () => {
        errorNoti("S???a b??nh lu???n th???t b???i", true);
      },
      body
    );

    setFlag(!flag);
  };

  //delete comment
  const deleteComment = async () => {
    // let edittedComment = await authDelete(
    //   dispatch,
    //   token,
    //   `/delete-comment-on-quiz/${comment.commentId}`,
    //   {}
    // );

    request(
      "delete",
      `/delete-comment-on-quiz/${comment.commentId}`,
      (res) => {
        successNoti("X??a b??nh lu???n th??nh c??ng", true);
      },
      () => {
        errorNoti("X??a b??nh lu???n th???t b???i", true);
      }
    );

    setFlag(!flag);
  };

  //format date
  const formatDate = (originalDate) => {
    let date = new Date(originalDate);

    return displayTime(date);
  };

  return (
    <div>
      <div className={classes.commentItem}>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            X??a b??nh lu???n
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Khi b???n x??a b??nh lu???n, c??c b??nh lu???n tr??? l???i c??ng m???t theo. <br />
              B???n c?? ch???c mu???n x??a?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              H???y b???
            </Button>
            <Button onClick={() => onConfirmDeleteComment()} color="secondary">
              X??a
            </Button>
          </DialogActions>
        </Dialog>
        <Avatar style={{ width: "30px", height: "30px", fontSize: "14px" }}>
          {comment.fullNameOfCreator.split(" ").pop().charAt(0).toUpperCase()}
        </Avatar>
        <div className={classes.commentContent}>
          <div>
            <b>{comment.fullNameOfCreator}</b>&nbsp;
            <span style={{ marginLeft: "5px" }}>
              {comment ? formatDate(comment.createdStamp) : null}
            </span>
          </div>
          <div>
            {!isEditting ? (
              comment.commentText
            ) : (
              <div>
                <Input
                  value={commentTextEdit}
                  onChange={(event) => setCommentTextEdit(event.target.value)}
                  type="text"
                />
                <Button
                  className={classes.commentActionBtn}
                  onClick={() => setIsEditting(false)}
                >
                  H???y
                </Button>
                <Button onClick={() => onHandleUpdateComment()}>
                  C???p nh???t
                </Button>
              </div>
            )}
          </div>
          {loginUser?.userName === comment.createdByUserLoginId && (
            <div>
              <Button
                className={classes.commentActionBtn}
                onClick={() => setIsEditting(!isEditting)}
              >
                Ch???nh s???a
              </Button>
              <Button
                className={classes.commentActionBtn}
                onClick={handleClickOpenModal}
              >
                X??a
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
