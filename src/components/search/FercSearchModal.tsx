import React, { useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { FluentCheckbox } from 'unity-fluent-library';

import { getFercAccounts } from '../../api/client';
import { FercAccountRecord } from '../../api/models';
import SearchModal from './SearchModal';
import SearchResultsTable from './SearchResultsTable';
import { FilterTableCell, FilterTextField } from './SearchComponents';

interface FercSearchModalProps {
  open: boolean;
  handleClose: (selectedAccount?: FercAccountRecord) => void;
}

const FercSearchModal = ({ open, handleClose }: FercSearchModalProps) => {
  const [selected, setSelected] = useState<FercAccountRecord | null>(null);

  return (
    <SearchModal
      title="Find FERC Accounts"
      errorMessage="An error occurred while loading FERC accounts"
      size="md"
      open={open}
      queryKeyPath="/fercaccount"
      queryFetcher={getFercAccounts}
      initialFilterValues={{
        fercAccount: '',
        description: '',
      }}
      handleClose={save => {
        save ? handleClose(selected || undefined) : handleClose();
      }}
    >
      {({
        data,
        filterValues: { fercAccount, description },
        onFilterChange,
        paginationProps,
      }) =>
        data && (
          <SearchResultsTable
            label="FERC Account Search Results"
            headers={['FERC Account', 'Description']}
            rows={data}
            renderRow={(row: FercAccountRecord) => {
              return (
                <TableRow key={row.id} hover onClick={() => setSelected(row)}>
                  <TableCell padding="checkbox">
                    <FluentCheckbox checked={selected?.id === row.id} />
                  </TableCell>
                  <TableCell>{row.fercAccount}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              );
            }}
            renderFilterFields={() => (
              <>
                <FilterTableCell>
                  <FilterTextField
                    value={fercAccount}
                    id="fercaccount"
                    placeholder="Filter by FERC Account"
                    onChange={e =>
                      onFilterChange('fercAccount', e.target.value)
                    }
                    autoFocus
                  />
                </FilterTableCell>
                <FilterTableCell>
                  <FilterTextField
                    value={description}
                    id="description"
                    placeholder="Filter by Description"
                    onChange={e =>
                      onFilterChange('description', e.target.value)
                    }
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

export default FercSearchModal;
