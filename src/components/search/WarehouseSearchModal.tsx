import React, { useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { FluentCheckbox } from 'unity-fluent-library';

import { getWarehouses } from '../../api/client';
import { WarehouseRecord } from '../../api/models';
import cloneAndRemove from '../../utils/cloneAndRemove';
import SearchModal from './SearchModal';
import SearchResultsTable from './SearchResultsTable';

type SelectedWarehouseData = { [key: number]: WarehouseRecord };

interface WarehouseSearchModalProps {
  open: boolean;
  exclude: number[];
  handleClose: (
    selectedIds?: number[],
    selectedData?: SelectedWarehouseData
  ) => void;
}

const WarehouseSearchModal = ({
  open,
  handleClose,
  exclude,
}: WarehouseSearchModalProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedWarehouseData>({});

  const renderRow = (row: WarehouseRecord) => {
    const isDisabled = exclude.includes(row.id);
    const isSelected = selected.includes(row.id);

    return (
      <TableRow
        key={row.id}
        hover={!isDisabled}
        onClick={
          isDisabled
            ? undefined
            : () => {
                if (!isSelected) {
                  setSelected(prev => [...prev, row.id]);
                  setSelectedData(prev => ({
                    ...prev,
                    [row.id]: row,
                  }));
                } else {
                  setSelected(prev => cloneAndRemove(prev, row.id));
                  setSelectedData(prev => cloneAndRemove(prev, row.id));
                }
              }
        }
      >
        <TableCell padding="checkbox">
          <FluentCheckbox disabled={isDisabled} checked={isSelected} />
        </TableCell>
        <TableCell>{row.warehouseCode}</TableCell>
        <TableCell>{row.warehouseName}</TableCell>
      </TableRow>
    );
  };

  return (
    <SearchModal
      title="Find Warehouse"
      errorMessage="An error occurred while loading warehouses"
      size="md"
      open={open}
      handleClose={save => {
        save ? handleClose(selected, selectedData) : handleClose();
        setSelected([]);
        setSelectedData({});
      }}
      initialFilterValues={{}}
      queryKeyPath={'/warehouse'}
      queryFetcher={getWarehouses}
    >
      {({ data, paginationProps }) =>
        data && data.length ? (
          <SearchResultsTable
            label="Warehouse Search Results"
            rows={data}
            headers={['Code', 'Warehouse Name']}
            renderRow={renderRow}
            PaginationProps={paginationProps}
          />
        ) : (
          <span>No results found!</span>
        )
      }
    </SearchModal>
  );
};

export default WarehouseSearchModal;
