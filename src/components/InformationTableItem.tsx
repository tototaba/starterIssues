import React from 'react';
import { Typography, makeStyles, Divider } from '@material-ui/core';
import { StatusChip } from 'unity-fluent-library';

const useStyles = makeStyles(theme => {
  return {
    root: {
      overflow: 'hidden',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(1),
      lineHeight: 2,
    },
    subject: {
      flex: 1,
      marginRight: 12,
      whiteSpace: 'nowrap',
    },
  };
});

const InformationTableItem = ({ subject, value, status, onClick }: any) => {
  const classes = useStyles();

  if (typeof value === 'boolean') value = value === true ? 'Yes' : 'No';
  else if (typeof value === 'number') value = value.toString();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper} onClick={onClick}>
        <Typography className={classes.subject} variant="body1">
          {subject}
        </Typography>
        {status && <StatusChip status={status} label={value} />}
        {!status && (
          <Typography
            variant="body1"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordBreak: 'break-word',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              // TODO: get color from theme
              ...(onClick ? { color: '#2951B8', cursor: 'pointer' } : {}),
            }}
            {...(typeof value === 'string' ? { title: value } : {})}
          >
            {value}
          </Typography>
        )}
      </div>
      <Divider />
    </div>
  );
};

export default InformationTableItem;
