import React, {useState} from 'react';
import RichTextEditor from "../../../common/editor/RichTextEditor";
import FileUploader from "../../../common/uploader/FileUploader";
import CustomizedDialogs from "../../../dialog/CustomizedDialogs";
import TertiaryButton from "../../../button/TertiaryButton";
import PrimaryButton from "../../../button/PrimaryButton";
import {errorNoti, successNoti} from "../../../../utils/notification";
import {request} from "../../../../api";

export default function CreateQuizDoingExplanationDialog(props) {
  const [explanationContent, setExplanationContent] = useState('');
  const [attachment, setAttachment] = useState();

  function createQuizDoingExplanation() {
    if (!explanationContent && !attachment) {
      errorNoti("Cần điền nội dung cách làm hoặc đính kèm file cách làm!", true);
      return;
    }
    let formData = new FormData();
    const { questionId, testId } = props;
    let explanation = { questionId, testId, explanationContent  }
    formData.append("explanation", new Blob([JSON.stringify(explanation)], { type: "application/json" }));
    formData.append("attachment", attachment);

    let successHandler = (res) => {
      successNoti("Thêm cách làm thành công, xem kết quả trên giao diện", true);
      props.onClose();
      props.onCreateSuccess(res);
    }
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi khi thêm cách làm!", true)
    }
    const config = {
      headers: {
        'Content-Type': "multipart/form-data"
      }
    }
    request("POST", "/quiz-doing-explanations", successHandler, errorHandlers, formData, config)
  }

  return (
    <CustomizedDialogs
      title="Thêm cách làm"
      open={props.open}
      handleClose={props.onClose}
      centerTitle
      contentTopDivider
      content={
        <>
          <RichTextEditor content={explanationContent}
                          onContentChange={htmlContent => setExplanationContent(htmlContent)}/>
          <FileUploader onChange={files => setAttachment(files[0])}/>
        </>
      }
      actions={
        <>
          <TertiaryButton onClick={props.onClose}>Huỷ</TertiaryButton>
          <PrimaryButton onClick={createQuizDoingExplanation}>Thêm</PrimaryButton>
        </>
      }
    />
  );
}