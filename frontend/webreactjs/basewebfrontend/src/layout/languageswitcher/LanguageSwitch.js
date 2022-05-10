import { Box, Button } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import "simplebar/dist/simplebar.min.css";
import UKflag from "../../assets/img/flags/UK-flag.png";
import VIflag from "../../assets/img/flags/VN-flag.png";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box>
      <Button onClick={() => changeLanguage("en")} sx={{margin: "0", padding: "0"}}>
        <img src={UKflag} alt="" style={{ width: "30px", height: "20px" }} />
      </Button>
      <Button onClick={() => changeLanguage("vi")} sx={{margin: "0", padding: "0"}}>
        <img src={VIflag} alt="" style={{ width: "30px", height: "20px" }} />
      </Button>
    </Box>
  );
};

export default LanguageSwitch;