import React, {useEffect, useState} from 'react';
import {errorNoti, successNoti} from "../../../../utils/notification";
import {request} from "../../../../api";
import FilePreview from "../../../common/uploader/FilePreview";

function QuizDoingExplanationDetail({ questionId }) {

  const [ solutions, setSolutions ] = useState([]);
  const [ attachments, setAttachments ] = useState([]);

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

  return (
    <div>
      {solutions.map((solution, index) => (
        <div key={index}>
          <div dangerouslySetInnerHTML={{__html: solution.solutionExplanation}}></div>
          { attachments[index] && (
            <FilePreview file={attachments[index]} width="560" height="400"/>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuizDoingExplanationDetail;