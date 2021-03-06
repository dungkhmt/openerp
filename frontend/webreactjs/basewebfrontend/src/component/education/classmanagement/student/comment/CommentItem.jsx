import { makeStyles } from "@material-ui/core/styles";
import { authPut, authDelete, authGet, authPost } from "../../../../../api";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Input,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ReplyCommentItem from "./ReplyCommentItem";
import { request } from "../../../../../api";
import displayTime from "utils/DateTimeUtils";
import { errorNoti, successNoti } from "utils/notification";
import { Fragment } from "react";

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
    flexGrow: 1,
    display: "flex",
  },
  commentActionBtn: {
    color: "#bbb",
    fontSize: "10px",
  },
  listComment: {
    marginLeft: theme.spacing(6),
  },
  displayMenu: {
    visibility: true,
  },
  hideMenu: {
    visibility: false,
  },
}));

export default function CommentItem({
  comment,
  commentFlag,
  setCommentFlag,
  loginUser,
}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isEditting, setIsEditting] = useState(false);
  const [commentTextEdit, setCommentTextEdit] = useState(comment.commentText);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShowReplyComment, setIsShowReplyComment] = useState(false);
  const [listReplyComment, setListReplyComment] = useState([]);
  const [isShowInputReply, setIsShowInputReply] = useState(false);
  const [replyCommentText, setReplyCommentText] = useState("");
  const [flag, setFlag] = useState(false);
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const open = Boolean(menuAnchorEl);
  const [isDisplayMenu, setIsDisplayMenu] = useState(false);

  const handleClose = () => {
    setMenuAnchorEl(null);
  };
  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    let getListReply = async () => {
      request(
        // token, history,
        "get",
        `/get-list-reply-comments-on-quiz/${comment.commentId}`,
        (res) => {
          setListReplyComment(res.data);
        }
      );
      /*
			let res = await authGet(
				dispatch,
				token,
				`/get-list-reply-comments-on-quiz/${comment.commentId}`
			);

			setListReplyComment(res);
			*/
    };

    getListReply();
  }, [flag]);

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
  //get list reply of comment
  const onGetListReplyComment = async (commentId) => {
    if (isShowReplyComment === false) {
      request(
        // token, history,
        "get",
        `/get-list-reply-comments-on-quiz/${commentId}`,
        (res) => {
          setListReplyComment(res.data);
        }
      );

      /*
		let res = await authGet(
        dispatch,
        token,
        `/get-list-reply-comments-on-quiz/${commentId}`
      );
      setListReplyComment(res);
		console.log(listReplyComment);
		*/
    }
    setIsShowReplyComment(!isShowReplyComment);
  };

  //edit comment
  const editComment = async () => {
    let body = {
      commentText: commentTextEdit,
    };

    /*
    let edittedComment = await authPut(
      dispatch,
      token,
      `/edit-comment-on-quiz/${comment.commentId}`,
      body
    );
		*/
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

    setCommentFlag(!commentFlag);
  };

  //delete comment
  const deleteComment = async () => {
    // let edittedComment = await authDelete(
    //   dispatch,
    //   token,
    //   `/delete-comment-on-quiz/${comment.commentId}`,
    //   {}
    // );

    // setCommentFlag(!commentFlag);
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

    setCommentFlag(!commentFlag);
  };

  //post reply comment
  const createComment = async () => {
    let body = {
      comment: replyCommentText.trim(),
      questionId: comment.questionId,
      replyToCommentId: comment.commentId,
    };

    if (replyCommentText.trim() !== "") {
      // /*
      // let commentPost = await authPost(
      //   dispatch,
      //   token,
      //   "/post-comment-on-quiz",
      //   body
      // );
      // */
      request(
        "post",
        "/post-comment-on-quiz",
        (res) => {
          if (200 === res.status) {
            onGetListReplyComment(comment.commentId);
            successNoti("????ng b??nh lu???n th??nh c??ng", true);
          }
        },
        {},
        body
      );
      setReplyCommentText("");
    } else {
      errorNoti("B??nh lu???n kh??ng th??? ????? tr???ng");
    }
  };

  //format date
  const formatDate = (originalDate) => {
    let date = new Date(originalDate);

    return displayTime(date);
  };

  return (
    <div>
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
      <div className={classes.commentItem}>
        <Avatar>
          {comment.fullNameOfCreator.split(" ").pop().charAt(0).toUpperCase()}
        </Avatar>
        <div
          className={classes.commentContent}
          onMouseEnter={() => setIsDisplayMenu(true)}
          onMouseLeave={() => setIsDisplayMenu(false)}
        >
          <div style={{ flexGrow: 1 }}>
            <div>
              <b>
                {`${comment.fullNameOfCreator} (${comment.createdByUserLoginId})`}
              </b>
              &nbsp;
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
            <div>
              <Button
                onClick={() => setIsShowInputReply(!isShowInputReply)}
                className={classes.commentActionBtn}
              >
                Ph???n h???i
              </Button>
              <Button
                onClick={() => onGetListReplyComment(comment.commentId)}
                className={classes.commentActionBtn}
              >
                {isShowReplyComment ? (
                  <span>&#x25B2; ???n ph???n h???i</span>
                ) : (
                  <span>&#x25BC; Xem c??c ph???n h???i</span>
                )}
              </Button>
              {/* {loginUser?.userName === comment.createdByUserLoginId && (
              <>
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
              </>
            )} */}
            </div>
          </div>
          <div style={{ height: "70px", minWidth: "70px" }}>
            {isDisplayMenu &&
              loginUser?.userName === comment.createdByUserLoginId && (
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  // className={isDisplayMenu ? classes.displayMenu : classes.hideMenu}
                  style={{ height: "70px", width: "70px" }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            <Menu
              id="long-menu"
              anchorEl={menuAnchorEl}
              open={open}
              onClose={handleClose}
              keepMounted
            >
              <MenuItem
                onClick={() => {
                  setIsEditting(!isEditting);
                  handleClose();
                }}
              >
                Ch???nh s???a
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClickOpenModal();
                  handleClose();
                }}
              >
                Xo??
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className={classes.listComment}>
        {isShowReplyComment && (
          <div>
            {listReplyComment.length > 0 &&
              listReplyComment.map((comment) => (
                <ReplyCommentItem
                  comment={comment}
                  flag={flag}
                  setFlag={setFlag}
                  loginUser={loginUser}
                />
              ))}
          </div>
        )}
        {isShowInputReply && (
          <div>
            <Input
              value={replyCommentText}
              onChange={(event) => setReplyCommentText(event.target.value)}
            />
            <Button onClick={createComment}>Ph???n h???i</Button>
          </div>
        )}
      </div>
    </div>
  );
}
