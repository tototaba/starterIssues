import React, { useState, useMemo } from 'react';
import { DialogProps } from '@material-ui/core';
import { AxiosResponse } from 'axios';
import { SideSheet } from 'unity-fluent-library';

import { useFleetQuery } from '../../api/query';
import useDebounced from '../../utils/useDebounced';
import ErrorDisplay from '../ErrorDisplay';
import { PaginationProps } from '../Pagination';

interface SearchModalProps<RecordType, FilterValues> {
  open: boolean;
  title: string;
  size?: DialogProps['maxWidth'];
  handleClose: (save: boolean) => void;
  error?: any;
  errorMessage?: string;
  children: (params: {
    data: RecordType[] | undefined;
    filterValues: FilterValues;
    onFilterChange: (fieldName: string, newValue: string) => void;
    paginationProps: PaginationProps;
  }) => React.ReactNode;
  queryKeyPath: string;
  queryFetcher: (params: any) => Promise<AxiosResponse<RecordType[]>>;
  filterData?: (data: RecordType[]) => RecordType[];
  getFilterQueryParams?: (filterValues: FilterValues) => { [key: string]: any };
  initialFilterValues: FilterValues;
}

const SearchModal = <RecordType, FilterValues extends {}>({
  title,
  errorMessage,
  open,
  size = 'sm',
  handleClose,
  queryKeyPath,
  queryFetcher,
  filterData = undefined,
  initialFilterValues,
  getFilterQueryParams = filterValues =>
    // Only include filters that have non-empty values
    Object.entries(filterValues).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as any),
  children: render,
}: SearchModalProps<RecordType, FilterValues>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState(initialFilterValues);

  const paginationParams = { limit: rowsPerPage, page: page + 1 };
  const params = useDebounced(
    {
      ...paginationParams,
      ...getFilterQueryParams(filterValues as any),
    },
    250,
    [rowsPerPage, page, ...Object.values(filterValues)]
  );

  const {
    result: preFilterData,
    error,
    isFetching,
    isPreviousData,
    pages,
  } = useFleetQuery([queryKeyPath, params], () => queryFetcher(params), {
    keepPreviousData: true,
  });

  const data = useMemo(
    () =>
      preFilterData && filterData ? filterData(preFilterData) : preFilterData,
    [preFilterData, filterData] // TODO: filterData will always change so useMemo is somewhat useless
  );

  const onFilterChange = (fieldName: string, newValue: string) => {
    setFilterValues(prevValues => ({ ...prevValues, [fieldName]: newValue }));
    setPage(0);
  };

  return (
    <SideSheet
      open={open}
      onClose={() => handleClose(false)}
      title={title}
      width={1000}
      // TODO: get maxWidth working
      style={{ maxWidth: '100vw' }}
      buttonLabel="Choose"
      onSubmit={() => handleClose(true)}
    >
      {error ? (
        <ErrorDisplay title={errorMessage} error={error!} /> // TODO: fix typescript version !!
      ) : (
        render({
          data,
          filterValues,
          onFilterChange,
          paginationProps: {
            page,
            setPage: (newPage: number) => {
              if (page + 1 === params.page && rowsPerPage === params.limit) {
                setPage(newPage);
              }
            },
            rowsPerPage,
            setRowsPerPage,
            isFetching,
            isPreviousData,
            hasNextPage: !!pages?.nextPage,
          },
        })
      )}
    </SideSheet>
  );
};

export default SearchModal;
