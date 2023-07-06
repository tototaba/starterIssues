import React, { useMemo } from 'react';

import { getStock, getStockWarehouses } from '../../api/client';
import { useFleetQuery } from '../../api/query';
import { StockWarehouseRecord } from '../../api/models';
import Picker, { BasePickerProps } from './Picker';
import DataPicker, { BaseDataPickerProps } from './DataPicker';

export const StockWarehousePicker = ({
  stockId,
  ...props
}: BaseDataPickerProps<number, StockWarehouseRecord> & { stockId: number }) => (
  <DataPicker
    {...props}
    queryKey={['/stock', stockId, '/warehouse', { limit: 100 }]}
    queryFetcher={() => getStockWarehouses(stockId, { limit: 100 })}
    itemLabel="warehouseCode"
    itemValue="warehouseId"
  />
);

// export const AllStockWarehousePicker = (props: BasePickerProps<number>) => {
//   const params = {
//     limit: 100,
//     hasWarehouse: true,
//     fractionalIssue: true,
//     includeChildren: true,
//   };

//   const { result: stock, error: fetchError } = useFleetQuery(
//     ['/stock', params],
//     () => getStock(params)
//   );

//   const stockWarehouseOptions = useMemo(
//     () =>
//       stock &&
//       stock.flatMap(({ stockNumber, stockWarehouses }) =>
//         stockWarehouses!.map(({ warehouseCode, stockWarehouseId }) => ({
//           label: `${stockNumber} - ${warehouseCode}`,
//           value: stockWarehouseId,
//         }))
//       ),
//     [stock]
//   );

//   const { error, helperText } = props;

//   return (
//     <Picker
//       options={stockWarehouseOptions || []}
//       fullWidth
//       {...props}
//       error={!!fetchError || error}
//       helperText={
//         (fetchError && 'Error: Unable to load stock warehouses.') || helperText
//       }
//     />
//   );
// };
