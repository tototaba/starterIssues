import React from 'react';

import { getEquipment, deleteEquipmentById } from '../../../api/client';
import { EquipmentRecord } from '../../../api/models';
import formatCurrency from '../../../utils/formatCurrency';
import { BasePage } from '../base';
import CreateEditEquipment from './CreateEditEquipment';

const Equipment = () => {
  return (
    <BasePage<EquipmentRecord>
      title="Equipment"
      fetchPath="/employee"
      getData={getEquipment}
      deleteItem={({ id }) => deleteEquipmentById(id)}
      createEditPage={CreateEditEquipment}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'equipmentCode' },
        { field: 'description' },
        {
          field: 'dailyMileage',
          type: 'rightAligned',
          cellRenderer: 'checkboxRenderer',
          filter: false, // TODO: add checkbox filter
        },
        {
          field: 'mileageRate',
          type: 'rightAligned',
          valueFormatter: ({ value }) => formatCurrency(value),
        },
        {
          field: 'hourlyRate',
          type: 'rightAligned',
          valueFormatter: ({ value }) => formatCurrency(value),
        },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default Equipment;
