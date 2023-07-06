import React from 'react';

import { getDistricts, deleteDistrictById } from '../../../api/client';
import { DistrictRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditDistrict from './CreateEditDistrict';

const District = () => {
  return (
    <BasePage<DistrictRecord>
      title="District"
      fetchPath="/district"
      getData={getDistricts}
      deleteItem={({ id }) => deleteDistrictById(id)}
      createEditPage={CreateEditDistrict}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'districtGuid', headerName: 'GUID' },
        { field: 'districtCode', headerName: 'Code' },
        { field: 'districtName', headerName: 'Name' },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default District;
