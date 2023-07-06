import React from 'react';

import { getFercAccounts, deleteFercAccountById } from '../../../api/client';
import { FercAccountRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditFercAccount from './CreateEditFercAccount';

const FercAccount = () => {
  return (
    <BasePage<FercAccountRecord>
      title="FERC Account"
      fetchPath="/fercaccount"
      getData={getFercAccounts}
      deleteItem={({ id }) => deleteFercAccountById(id)}
      createEditPage={CreateEditFercAccount}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'fercAccount', headerName: 'FERC Account' },
        { field: 'description', headerName: 'Description' },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default FercAccount;
