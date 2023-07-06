import React from 'react';
import { Card, CardContent, Divider } from '@material-ui/core';

export const ListElement = ({ subject, value, style }: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 8,
        ...style,
      }}
    >
      <div style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>
        {subject}
      </div>
      <div style={{ fontSize: 14, marginBottom: 8 }}>{value}</div>
      <Divider />
    </div>
  );
};

export const ListCard = ({ children }: any) => {
  return (
    <Card elevation={0} style={{ height: '100%' }}>
      <CardContent style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column wrap',
            height: '100%',
            columnGap: 8,
          }}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
