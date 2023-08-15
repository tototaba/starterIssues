import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    maxWidth: 465,
  },
}));

const ImagePreview = props => {
  const { image } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.image} src={image} alt="upload preview" />
    </div>
  );
};
export default ImagePreview;
