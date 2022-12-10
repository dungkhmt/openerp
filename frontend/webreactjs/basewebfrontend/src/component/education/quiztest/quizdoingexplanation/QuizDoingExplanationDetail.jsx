import React, {useEffect, useState} from 'react';
import {errorNoti, successNoti} from "../../../../utils/notification";
import {request} from "../../../../api";
import FilePreview from "../../../common/uploader/FilePreview";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateQuizDoingExplanationDialog from "./UpdateQuizDoingExplanationDialog";

const useStyles = makeStyles(theme => ({
  solutionContainer: {
    border: '1px solid black',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  },
  solutionExplanation: {
    marginBottom: '10px'
  },
  actions: {
    display: "flex",
    columnGap: '10px',
    marginBottom: '10px'
  }
}))

function QuizDoingExplanationDetail({ questionId }) {
  const classes = useStyles();
  const [ solutions, setSolutions ] = useState([]);
  const [ attachments, setAttachments ] = useState([]);
  const [ updateExplanationDialogOpen, setUpdateExplanationDialogOpen] = useState(false);
  const [ updatedSolution, setUpdatedSolution] = useState({ solutionExplanation: null, attachment: null });

  useEffect(getSolutionsForQuestion, []);

  function getSolutionsForQuestion() {
    let successHandler = (res) => setSolutions(res.data);
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi khi tải dữ liệu")
    }
    request("GET", `/quiz-doing-explanations/${questionId}`, successHandler, errorHandlers);
  }

  useEffect(getCorrespondingAttachmentsForSolutions, [solutions]);

  async function getCorrespondingAttachmentsForSolutions() {
    let attachments = await Promise.all(
      solutions.map( solution => getAttachmentByStorageId(solution.attachment) )
    );
    setAttachments(attachments)
  }

  async function getAttachmentByStorageId(storageId) {
    let attachment;
    const convertResponseToBlob = (res) => {
      console.log("Response", res);
      // attachment = new Blob([res.data], { type: res.headers["content-type"]});
      attachment = res.data;
      console.log("Attachment", attachment);
    }
    let errorHandlers = {
      onError: (error) => console.log("error", error)
    }
    await request("GET", `/content/get/${storageId}`, convertResponseToBlob, errorHandlers,null, { responseType: 'blob'});
    return attachment;
  }

  function openUpdateExplanationDialog(solution, attachment) {
    setUpdatedSolution({ ...solution, attachment});
    setUpdateExplanationDialogOpen(true);
  }

  return (
    <div>
      {solutions.map((solution, index) => (
        <div key={index} className={classes.solutionContainer}>
          <div className={classes.actions}>
            <Button variant="contained" color="primary"
                    onClick={ () => openUpdateExplanationDialog(solution, attachments[index]) }>
              <EditIcon/>Chỉnh sửa
            </Button>
            <Button variant="contained" color="error">
              <DeleteForeverIcon/>Xóa
            </Button>
          </div>

          <div className={classes.solutionExplanation}
               dangerouslySetInnerHTML={{__html: solution.solutionExplanation}}/>
          { attachments[index] && (
            <>
              <FilePreview file={attachments[index]} width="392" height="280"/>

              <a href={URL.createObjectURL(attachments[index])} download>
                <Button>
                  <DownloadIcon/>Tải về
                </Button>
              </a>
            </>
          )}
        </div>
      ))}

      <UpdateQuizDoingExplanationDialog solution={updatedSolution}
                                        open={updateExplanationDialogOpen}
                                        onClose={() => setUpdateExplanationDialogOpen(false)}/>
    </div>
  );
}

export default QuizDoingExplanationDetail;