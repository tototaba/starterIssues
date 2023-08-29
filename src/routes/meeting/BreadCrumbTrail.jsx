import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust the gap between chips as needed
  },
});

const BreadcrumbTrail = ({ items }) => {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => (
        <p>{item}</p>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbTrail;
