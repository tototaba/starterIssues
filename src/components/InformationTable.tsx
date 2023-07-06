import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import InformationTableItem from './InformationTableItem';

interface InformationTableProps {
  className?: string;
  data: {
    component?: JSX.Element;
    field?: string;
    onClick?: () => void;
    value?: number | boolean | string | null | undefined | any;
  }[];
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'grid',
    columnGap: '16px',
    padding: '0 4px',
    margin: '16px 0',
    gridTemplateColumns: 'minmax(320px, 1fr)',
    overflowX: 'hidden',
  },
});

export const InformationTable = ({
  className,
  data,
}: InformationTableProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      {data.map(
        ({ component, field, value, onClick }) =>
          component ?? (
            <InformationTableItem
              subject={field}
              value={value}
              onClick={onClick}
            />
          )
      )}
    </div>
  );
};

export default InformationTable;
