import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import ReactHtmlParser from "react-html-parser";
import Footer from "./Footer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/Inter (web)/Inter-Light.woff",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/Inter (web)/Inter-Regular.woff",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: "12px",
    padding: 40,
    flexGrow: 1,
  },
  question: {
    marginTop: "20px",
    marginBottom: "4px",
  },
  answer: {
    marginTop: "4px",
    marginBottom: "4px",
    flexGrow: 1,
    flexShrink: 1,
    display: "inline",
  },
  bold: {
    fontWeight: "bold",
  },
  textLine: {
    marginBottom: "4px",
  },
  imageContainer: {
    display: "flex",
    alignItems: "flex-start",
    maxHeight: "300px",
  },
});

const checkBoxBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACoSURBVFhH7dexDcMgFEXRn6zADsxFh0TFFOxAx1zsQE3pBERK632chuKdBhkJ6wpZNn5dX3KQ9xqPwSCEQQiDkOOCVC/GWquUUqS1tmb2GGPEOSfW2jVzT7VD/8QMY+24h4Zqh7z3c8w5z3HXzno+1AiDEAYhDEIYhDAIOS5I9bWPMUrvfV09M85EKaV1dU+1QyGEecOnfgc0Df5KIwxCGIQwCDksSOQD5Zw1Tp9gAfMAAAAASUVORK5CYII=";

// Create Document Component
function ExamQuestionsOfParticipantPDFDocument({ data }) {
  const {
    userId,
    userDetail,
    testName,
    scheduleDatetime,
    courseName,
    duration,
    quizGroupId,
    groupCode,
    viewTypeId,
    listQuestion,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View>
          <Text style={styles.textLine}>Quiz test: {testName}</Text>
          <Text style={styles.textLine}>Môn: {courseName}</Text>
          <Text style={styles.textLine}>MSSV: {userId}</Text>
          <Text style={styles.textLine}>
            Họ tên:{" "}
            {`${userDetail?.firstName} ${userDetail?.middleName} ${userDetail?.lastName}`}
          </Text>
          <Text style={styles.textLine}>Bắt đầu: {scheduleDatetime}</Text>
          <Text style={styles.textLine}>Thời gian: {duration} phút</Text>

          {/* Questions */}
          {listQuestion.map((q, index) => (
            <View>
              <Text key={q.questionId} style={styles.question}>
                <Text style={styles.bold}>Câu {index + 1}. </Text>
                {ReactHtmlParser(q.statement)}
              </Text>
              {q.attachment.length > 0 &&
                q.attachment.map((url, index) => (
                  <View style={styles.imageContainer}>
                    <Image
                      key={index}
                      src={`data:application/pdf;base64,${url}`}
                      style={{
                        objectFit: "scale-down",
                      }}
                    />
                  </View>
                ))}
              {q.quizChoiceAnswerList.map((ans) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    key={index}
                    src={`data:application/pdf;base64,${checkBoxBase64}`}
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <Text style={styles.answer}>
                    {ReactHtmlParser(ans.choiceAnswerContent)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <Footer />
      </Page>
    </Document>
  );
}

export default ExamQuestionsOfParticipantPDFDocument;
