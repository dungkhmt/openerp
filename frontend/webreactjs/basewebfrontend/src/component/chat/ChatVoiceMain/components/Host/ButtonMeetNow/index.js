import { useHistory } from "react-router";
import { request } from "../../../../../../api";
import PrimaryButton from "../../../../../button/PrimaryButton";

export default function ButtonMeetNow() {
  const history = useHistory();
  const meetNow = async () => {
    request(
      "post",
      "/room/create",
      (res) => {
        history.push({
          pathname: `main/${res.data.roomId}`,
        });
      },
      {
        onError: (e) => {
          console.log("co loi");
        },
      },
      {}
    );
  };
  return (
    <PrimaryButton onClick={meetNow} id="button-meet-now">
      Tạo cuộc gặp ngay
    </PrimaryButton>
  );
}
