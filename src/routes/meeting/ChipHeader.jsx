import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { CalendarIcon } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
          variant={item.variant || "outlined"}
          color='primary'
          icon={item.icon}
          clickable={item.clickable}
          href={item.href}
          component={item.component}
          target={item.target}
        />
      ))}
    </div>
  );
};

