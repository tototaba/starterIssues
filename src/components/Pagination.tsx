import React from 'react';
import {
  makeStyles,
  Theme,
  TablePagination,
  Grid,
  // CircularProgress,
} from '@material-ui/core';

export interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  hasNextPage: boolean;
  isFetching: boolean;
  isPreviousData: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(0.5),
  },
  caption: {
    fontSize: 14,
  },
}));

const Pagination = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  hasNextPage,
  isFetching,
  isPreviousData,
}: PaginationProps) => {
  const styles = useStyles();

  return (
    <Grid container alignItems="center" className={styles.root}>
      <Grid item>
        {isFetching
          ? // TODO: do we want to show a loading indicator?
            // <CircularProgress />
            null
          : null}
      </Grid>
      <Grid item xs>
        <TablePagination
          component="div"
          count={-1}
          classes={{ caption: styles.caption }}
          style={{ fontSize: 14 }}
          page={page}
          labelDisplayedRows={({ from, to }) => `${from}-${to}`}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          nextIconButtonProps={{
            disabled: isPreviousData || !hasNextPage,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Pagination;
