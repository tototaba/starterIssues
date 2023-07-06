import React, { useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { FluentCheckbox } from 'unity-fluent-library';

import { getStock } from '../../api/client';
import { StockRecord } from '../../api/models';
import cloneAndRemove from '../../utils/cloneAndRemove';
import SearchModal from './SearchModal';
import SearchResultsTable from './SearchResultsTable';
import {
  FilterTableCell,
  FilterTextField,
  FilterPickerField,
} from './SearchComponents';

type SelectedStockData = { [key: number]: StockRecord };

interface StockSearchModalProps {
  mode?: 'single' | 'multiple';
  open: boolean;
  exclude: number[];
  handleClose: (selectedStock?: StockRecord[]) => void;
}

const StockSearchModal = ({
  mode = 'multiple',
  open,
  handleClose,
  exclude,
}: StockSearchModalProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedStockData>({});

  return (
    <SearchModal
      title="Find Stock"
      errorMessage="An error occurred while loading stock"
      size="md"
      open={open}
      handleClose={save => {
        save
          ? handleClose(selected.map(id => selectedData[id]))
          : handleClose();
        setSelected([]);
        setSelectedData({});
      }}
      queryKeyPath={'/stock'}
      queryFetcher={getStock}
      getFilterQueryParams={({ stockNumber, description, installable }) => ({
        ...(stockNumber && { stockNumber }),
        ...(description && { description }),
        ...(installable && {
          available: installable === 'false' ? false : true,
        }),
      })}
      initialFilterValues={{
        stockNumber: '',
        description: '',
        installable: '',
      }}
    >
      {({
        data,
        filterValues: { stockNumber, description, installable },
        onFilterChange,
        paginationProps,
      }) =>
        data && (
          <SearchResultsTable
            label="Stock Search Results"
            headers={['Stock', 'Description', 'Installable']}
            rows={data}
            renderRow={(row: StockRecord) => {
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
                          if (mode === 'multiple') {
                            if (!isSelected) {
                              setSelected(prev => [...prev, row.id]);
                              setSelectedData(prev => ({
                                ...prev,
                                [row.id]: row,
                              }));
                            } else {
                              setSelected(prev => cloneAndRemove(prev, row.id));
                              setSelectedData(prev =>
                                cloneAndRemove(prev, row.id)
                              );
                            }
                          } else {
                            setSelected([row.id]);
                            setSelectedData({ [row.id]: row });
                          }
                        }
                  }
                >
                  <TableCell padding="checkbox">
                    <FluentCheckbox
                      disabled={isDisabled}
                      checked={isSelected}
                    />
                  </TableCell>
                  <TableCell>{row.stockNumber}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  {/* TODO: get strings from elsewhere */}
                  <TableCell>
                    {row.available ? 'Installable' : 'Obsolete'}
                  </TableCell>
                </TableRow>
              );
            }}
            renderFilterFields={() => (
              <>
                <FilterTableCell>
                  <FilterTextField
                    autoFocus
                    value={stockNumber}
                    placeholder="Filter by Stock"
                    onChange={e =>
                      onFilterChange('stockNumber', e.target.value)
                    }
                  />
                </FilterTableCell>
                <FilterTableCell>
                  <FilterTextField
                    value={description}
                    placeholder="Filter by Description"
                    onChange={e =>
                      onFilterChange('description', e.target.value)
                    }
                  />
                </FilterTableCell>
                <FilterTableCell>
                  <FilterPickerField
                    value={installable}
                    onChange={e =>
                      onFilterChange('installable', e.target.value)
                    }
                    options={[
                      { label: 'All', value: '' },
                      { label: 'Installable', value: 'true' },
                      { label: 'Obsolete', value: 'false' },
                    ]}
                  />
                </FilterTableCell>
              </>
            )}
            PaginationProps={paginationProps}
          />
        )
      }
    </SearchModal>
  );
};

export default StockSearchModal;
