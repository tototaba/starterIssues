import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

import Pagination, { PaginationProps } from '../Pagination';

interface SearchResultsTableProps {
  label: string;
  rows: any[];
  headers: string[];
  renderRow: (row: any) => JSX.Element;
  renderFilterFields?: () => JSX.Element;
  PaginationProps?: PaginationProps;
}

const useStyles = makeStyles({
  container: {
    // height: '100%',
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    overflow: 'auto',
    height: '100%',
  },
  table: {
    minWidth: 650,
  },
});

const SearchResultsTable = ({
  label,
  renderRow,
  renderFilterFields,
  headers,
  rows,
  PaginationProps,
}: SearchResultsTableProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} variant="outlined">
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader className={classes.table} aria-label={label}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              {headers.map((name, index) => (
                <TableCell key={index}>{name}</TableCell>
              ))}
            </TableRow>
            {renderFilterFields && (
              <TableRow>
                <TableCell padding="checkbox" />
                {renderFilterFields()}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {rows.length ? (
              rows.map(renderRow)
            ) : (
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell colSpan={100}>No results found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {PaginationProps && <Pagination {...PaginationProps} />}
    </Paper>
  );
};

export default SearchResultsTable;
