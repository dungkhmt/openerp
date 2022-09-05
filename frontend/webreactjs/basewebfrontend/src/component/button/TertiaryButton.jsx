import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import { Button } from "@mui/material";
// import { styled } from "@mui/material/styles";

const TertiaryButton = withStyles((theme) => ({
  root: {
    textTransform: "none",
  },
}))((props) => (
  <Button color="primary" {...props}>
    {props.children}
  </Button>
));

// const TertiaryButton = styled((props) => (
//   <Button color="primary" {...props}>
//     {props.children}
//   </Button>
// ))(({ theme }) => ({
//   textTransform: "none",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   textTransform: "none",
// }));

// const TertiaryButton = (props) => (
//   <StyledButton color="primary" {...props}>
//     {props.children}
//   </StyledButton>
// );

export default TertiaryButton;
