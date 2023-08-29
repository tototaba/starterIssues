import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Adjust the gap between chips as needed
  },
});

export const ChipHeader = ({ items }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item.text}
          variant="default"
          color='secondary'
        />
      ))}
    </div>
  );
};

