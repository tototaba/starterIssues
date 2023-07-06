import React, { useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { FluentCheckbox } from 'unity-fluent-library';

import { useFleetQuery } from '../../api/query';
import { getListCodes, getSubassemblies } from '../../api/client';
import { SubassemblyRecord } from '../../api/models';
import cloneAndRemove from '../../utils/cloneAndRemove';
import SearchModal from './SearchModal';
import SearchResultsTable from './SearchResultsTable';
import {
  FilterTableCell,
  FilterTextField,
  FilterPickerField,
} from './SearchComponents';

type SelectedSubassemblyData = { [key: number]: SubassemblyRecord };

interface SubassemblySearchModalProps {
  open: boolean;
  exclude: number[];
  handleClose: (
    selectedIds?: number[],
    selectedData?: SelectedSubassemblyData
  ) => void;
}

const SubassemblySearchModal = ({
  open,
  handleClose,
  exclude,
}: SubassemblySearchModalProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedSubassemblyData>({});

  const { result: listCodes, error: fetchListCodeError } = useFleetQuery(
    ['/listcode', { limit: 100 }],
    () => getListCodes({ limit: 100 })
  );

  return (
    <SearchModal
      title="Find Subassembly"
      errorMessage="An error occurred while loading subassemblies"
      size="md"
      open={open}
      handleClose={save => {
        save ? handleClose(selected, selectedData) : handleClose();
        setSelected([]);
        setSelectedData({});
      }}
      queryKeyPath={'/subassembly'}
      queryFetcher={getSubassemblies}
      initialFilterValues={{
        code: '',
        description: '',
        listCode: '',
      }}
    >
      {({
        data,
        filterValues: { code, description, listCode },
        onFilterChange,
        paginationProps,
      }) =>
        data && (
          <SearchResultsTable
            label="Subassembly Search Results"
            headers={['Subassembly', 'Description', 'List Code']}
            rows={data}
            renderRow={(row: SubassemblyRecord) => {
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
                            setSelectedData(prev =>
                              cloneAndRemove(prev, row.id)
                            );
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
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.listCode}</TableCell>
                </TableRow>
              );
            }}
            renderFilterFields={() => (
              <>
                <FilterTableCell style={{ maxWidth: '40%' }}>
                  <FilterTextField
                    autoFocus
                    // variant="outlined"
                    value={code}
                    id="subassembly"
                    placeholder="Filter by Name"
                    onChange={e => onFilterChange('code', e.target.value)}
                  />
                </FilterTableCell>
                <FilterTableCell style={{ maxWidth: '40%' }}>
                  <FilterTextField
                    value={description}
                    id="description"
                    placeholder="Filter by Description"
                    onChange={e =>
                      onFilterChange('description', e.target.value)
                    }
                  />
                </FilterTableCell>
                <FilterTableCell style={{ maxWidth: '20%' }}>
                  {fetchListCodeError ? (
                    <span>An error occurred while loading list codes.</span>
                  ) : (
                    <FilterPickerField
                      value={listCode}
                      id="description"
                      onChange={e => onFilterChange('listCode', e.target.value)}
                      includePlaceholder
                      placeholderLabel="Filter by List Code"
                      options={
                        listCodes
                          ? listCodes.map(listCode => ({
                              value: listCode.listCode,
                              label: `${listCode.listCode} - ${listCode.listCodeDescription}`,
                            }))
                          : []
                      }
                    />
                  )}
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

export default SubassemblySearchModal;
