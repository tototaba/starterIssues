import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  hintContainer: {
    borderLeft: `3px solid ${theme.palette.primary.main}`
  },
  hintContent: {
    backgroundColor: '#F3F9FE',
    padding: `1rem`
  },
  hideHintButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#0B79D0',
    textDecoration: 'none'
  },
  hidehelp: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%'
  }
}));

export const HintPanel = ({ hint, hideHintText }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [showHint, setShowHint] = useState(true);

  const handleHideHint = () => {
    setShowHint(false);
  };

  return (
    <div className={classes.hintContainer}>
      {showHint && (
        <div className={classes.hintContent}>
          <div>{hint}</div>
          <div className={classes.hidehelp}>
            <button className={classes.hideHintButton} onClick={handleHideHint}>
              {hideHintText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

HintPanel.propTypes = {
  hint: PropTypes.string.isRequired, // Hint content to be displayed
  hideHintText: PropTypes.string.isRequired // Text for the hide hint button
};
