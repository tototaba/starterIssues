import React from 'react';

import { getListCodes, deleteListCodeById } from '../../../api/client';
import { ListCodeRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditListCode from './CreateEditListCode';

const ListCode = () => {
  return (
    <BasePage<ListCodeRecord>
      title="List Code"
      fetchPath="/listcode"
      getData={getListCodes}
      deleteItem={({ id }) => deleteListCodeById(id)}
      createEditPage={CreateEditListCode}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'listCode', headerName: 'List Code' },
        { field: 'listCodeDescription', headerName: 'Description' },
        { field: 'featureType', headerName: 'Feature Type' },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default ListCode;
