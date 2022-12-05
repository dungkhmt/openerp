import React from 'react';
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  filePreview: {
    border: "solid gray 2px",
    borderRadius: "5px"
  }
}))

const FALLBACK_CONTENT_TYPE = "text/plain";

export default function FilePreview(props) {
  const classes = useStyles();
  const file = props.file;
  const src = URL.createObjectURL(file);
  const type = file.type || FALLBACK_CONTENT_TYPE;

  return (
    <embed src={src} key={src} type={type}
           className={classes.filePreview} {...props}/>
  );
}

FilePreview.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}