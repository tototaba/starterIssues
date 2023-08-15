import TimeAgo from 'timeago-react';
import React from 'react';
import moment from 'moment';

export const mockDateRange = (days, type) => {
  const initStartDate = new Date();
  const setStartDate = initStartDate.getDate() + days;
  initStartDate.setDate(setStartDate);
  console.log('DATE', initStartDate);
  if (type === 'natural') {
    return <TimeAgo datetime={initStartDate.toLocaleDateString('en-US')} />;
  } else if (type === 'calendar') {
    return initStartDate.toLocaleDateString('en-US');
  } else if (type === 'day') {
    return moment(initStartDate).format('dddd, LL');
  } else if (type === 'now') {
    return <TimeAgo datetime={new Date()} />;
  } else {
    return moment(initStartDate).format('ll');
  }
};
