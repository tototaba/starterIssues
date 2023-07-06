import React from 'react';

import {
  getUnitOfMeasures,
  deleteUnitOfMeasureById,
} from '../../../api/client';
import { UnitOfMeasureRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditUnitOfMeasure from './CreateEditUnitOfMeasure';

const UnitOfMeasure = () => {
  return (
    <BasePage<UnitOfMeasureRecord>
      title="Unit of Measure"
      fetchPath="/unitofmeasure"
      getData={getUnitOfMeasures}
      deleteItem={({ id }) => deleteUnitOfMeasureById(id)}
      createEditPage={CreateEditUnitOfMeasure}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'unitOfMeasure', headerName: 'Unit' },
        { field: 'unitOfMeasureDescription', headerName: 'Description' },
        // { field: 'unitOfMeasureType', headerName: 'Type' },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default UnitOfMeasure;
