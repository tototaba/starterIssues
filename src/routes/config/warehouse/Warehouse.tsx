import React from 'react';
import { useHistory } from 'react-router-dom';

import { getWarehouses, deleteWarehouseById } from '../../../api/client';
import { WarehouseRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditWarehouse from './CreateEditWarehouse';

const Warehouse = () => {
  const history = useHistory();

  return (
    <BasePage<WarehouseRecord>
      title="Warehouses"
      fetchPath="/warehouse"
      getData={getWarehouses}
      deleteItem={({ id }) => deleteWarehouseById(id)}
      createEditPage={CreateEditWarehouse}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'warehouseCode', headerName: 'Code' },
        { field: 'warehouseName', headerName: 'Name' },
        { field: 'fercAccount', headerName: 'FERC Account' },
        { field: 'address1', headerName: 'Address 1' },
        { field: 'address2', headerName: 'Address 2' },
        {
          field: 'id',
          ...getActionsColumnDef({
            rendererParams: {
              openViewPage: ({ id }: WarehouseRecord) =>
                history.push(`/warehouse/${id}`),
            },
            width: 155,
          }),
        },
      ]}
    />
  );
};

export default Warehouse;
