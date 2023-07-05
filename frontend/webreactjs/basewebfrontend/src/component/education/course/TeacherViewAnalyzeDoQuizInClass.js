import React, { useEffect, useRef } from "react";
import { request } from "../../../api";
import { toFormattedDateTime } from "../../../utils/dateutils";
function TeacherViewLogUserQuizList(props) {
    const { classId } = props;
    const [data, setData] = useState([]);

    const columns = [
        {title:"UserID",field:"userId"},
        {title:"FullName",field:"fullname"},
        {title:"numberSelect",field:"numberSelect"},
        {title:"numberCorrect",field:"numberCorrect"},
        {title:"numberCorrectFastest",field:"numberCorrectFastest"}
        
    ];
    function getData(){
        request(
            "get",
            "/get-analyze-do-quiz-in-class/" + classId,
            (res) => {
              console.log("get data analyze do quiz in class, res = ", res);
              const data = res.data;
              const content = data.content.map((c) => ({
                ...c,
                date: toFormattedDateTime(c.date),
              }));

              
            },
            {
              onError: (e) => {
                reject({
                  message:
                    "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
                  errorCause: "query",
                });
              },
            }
          );

    }

    useEffect(() => {
        getData();
      }, []);
    return (
        <>
            <MaterialTable
            title={"Data"}
            columns={columns}
            data={data}
          />
        </>
    );
}