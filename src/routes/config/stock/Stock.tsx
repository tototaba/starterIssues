import React from 'react';
import { useHistory } from 'react-router-dom';

import { deleteStockById, getStock } from '../../../api/client';
import { StockRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditStock from './ui/CreateEditStock';

const Stock = () => {
  const history = useHistory();

  return (
    <BasePage<StockRecord>
      title="Stock"
      fetchPath="/stock"
      getData={getStock}
      deleteItem={({ id }) => deleteStockById(id)}
      createEditPage={CreateEditStock}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'stockNumber', headerName: 'Stock' },
        { field: 'description', headerName: 'Description' },
        // { field: 'fercAccount', headerName: 'FERC Account' },
        {
          field: 'available',
          headerName: 'Installable',
          cellRenderer: 'checkboxRenderer',
          maxWidth: 120,
          filter: false, // TODO: add checkbox filter
        },
        {
          field: 'majorItem',
          headerName: 'Physical Inventory',
          cellRenderer: 'checkboxRenderer',
          maxWidth: 120,
          filter: false, // TODO: add checkbox filter
        },
        {
          field: 'id',
          ...getActionsColumnDef({
            rendererParams: {
              openViewPage: ({ id }: StockRecord) =>
                history.push(`/stock/${id}`),
            },
            width: 155,
          }),
        },
      ]}
    />
  );
};

export default Stock;
