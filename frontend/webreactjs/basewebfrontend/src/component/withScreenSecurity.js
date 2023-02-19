import { useEffect, useState } from "react";
import { request } from "../api";
import Loading from "./common/Loading";
import NotAuthorized from "./common/NotAuthorized";

function withScreenSecurity(SecuredComponent, screenName, viewError) {
  return function ScreenSecurityComponent({ ...props }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // console.log(SecurityComponent.name);

    useEffect(() => {
      setIsChecking(true);

      request(
        "get",
        `/check-authority?applicationId=${screenName}`,
        (res) => {
          // console.log(res);
          setIsChecking(false);
          if (res.data.result === "INCLUDED") setIsAuthorized(true);
        },
        {
          onError: (e) => {
            setIsChecking(false);
            console.log(e);
          },
        }
      );
    }, []);

    if (isChecking) return <Loading />;
    else if (isAuthorized) return <SecuredComponent {...props} />;
    else if (viewError) return <NotAuthorized />;
    else return "";
  };
}

export default withScreenSecurity;
