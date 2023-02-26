import { useState } from "@hookstate/core";
import { Avatar, IconButton } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useKeycloak } from "@react-keycloak/web";
import randomColor from "randomcolor";
import React, { useEffect } from "react";
import { AccountMenu } from "./AccountMenu";

const bgColor = randomColor({
  luminosity: "dark",
  hue: "random",
});

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 36,
    height: 36,
    background: bgColor,
  },
}));

const menuId = "primary-search-account-menu";

function AccountButton() {
  const classes = useStyles();

  //
  const { keycloak } = useKeycloak();

  const open = useState(false);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open.get());
  const anchorRef = React.useRef(null);

  //
  const handleToggle = () => {
    open.set((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    if (prevOpen.current === true && open.get() === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open.get();
  }, [open.get()]);

  return (
    <>
      <IconButton
        disableRipple
        component="span"
        ref={anchorRef}
        aria-haspopup="true"
        aria-label="account of current user"
        aria-controls={open.get() ? menuId : undefined}
        onClick={handleToggle}
      >
        <Avatar alt="account button" className={classes.avatar}>
          {keycloak.tokenParsed.name
            ?.split(" ")
            .pop()
            .substring(0, 1)
            .toLocaleUpperCase()}
        </Avatar>
      </IconButton>
      <AccountMenu
        open={open}
        id={menuId}
        anchorRef={anchorRef}
        avatarBgColor={bgColor}
      />
    </>
  );
}

// AccountButton.whyDidYouRender = {
//   logOnDifferentValues: true,
// };

export default React.memo(AccountButton);
