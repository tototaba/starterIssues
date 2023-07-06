import React from 'react';
import { ColDef } from '@ag-grid-community/core';
import { AmbientGridTemplate } from 'unity-fluent-library';

import { WorkOrderEstimateConstructionUnitRecord } from '../../../api/models';
import formatCurrency from '../../../utils/formatCurrency';

interface AssembliesTabProps {
  constructionUnits: WorkOrderEstimateConstructionUnitRecord[];
}

const AssembliesTab = ({ constructionUnits }: AssembliesTabProps) => {
  const listAggParams: Partial<ColDef> = {
    // get array of unique values
    aggFunc: ({ values }) => Array.from(new Set(values.flat())),
    // format properly if value was aggregated (and is an array)
    valueFormatter: ({ value }) =>
      Array.isArray(value) ? value.join(', ') : value,
  };

  const columnDefs: ColDef[] = [
    {
      field: 'stationNumber',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'assemblyCode',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'subassemblyCode',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      valueGetter: ({ node }) => {
        return node?.field === 'stationNumber'
          ? 'CPR'
          : node?.field === 'assemblyCode'
          ? 'Assembly'
          : node?.field === 'subassemblyCode'
          ? 'Sub-Assembly'
          : 'Inventory';
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      aggFunc: ({ values, rowNode }) => {
        const { assemblyDescription, subassemblyDescription } = values[0] || {};

        return rowNode?.field === 'assemblyCode'
          ? { assemblyDescription }
          : rowNode?.field === 'subassemblyCode'
          ? {
              assemblyDescription,
              subassemblyDescription,
            }
          : {};
      },
      valueGetter: ({
        data: {
          assemblyDescription,
          subassemblyDescription,
          stockDescription,
        } = {},
      }: {
        data: WorkOrderEstimateConstructionUnitRecord | undefined;
      }) => ({
        assemblyDescription,
        subassemblyDescription,
        stockDescription,
      }),
      valueFormatter: ({ value }) =>
        value.stockDescription ||
        value.subassemblyDescription ||
        value.assemblyDescription ||
        '',
    },
    {
      field: 'eriName',
      headerName: 'I/R',
      cellStyle: ({ value }) => {
        return value === 'Install'
          ? { color: 'green' }
          : value === 'Remove'
          ? { color: 'red' }
          : null;
      },
    },
    {
      field: 'totalStockQuantity',
      headerName: 'QTY',
      aggFunc: 'sum',
      valueGetter: ({
        data,
      }: {
        data: WorkOrderEstimateConstructionUnitRecord | undefined;
      }) =>
        data?.calloutQuantity ??
        data?.subassemblyCount ??
        data?.totalStockQuantity ??
        0,
    },
    {
      field: 'issueUnitOfMeasure',
      headerName: 'QTY UOM',
      ...listAggParams,
    },
    {
      field: 'unitPrice',
      headerName: 'Rate',
      aggFunc: 'sum',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    {
      field: 'totalStockCost',
      headerName: 'Total',
      aggFunc: 'sum',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    {
      field: 'warehouseCode',
      headerName: 'Warehouse',
      ...listAggParams,
    },
  ];

  return (
    <AmbientGridTemplate
      title="Assemblies"
      data={constructionUnits}
      columnDefs={columnDefs}
      suppressAggFuncInHeader
      autoGroupColumnDef={{
        headerName: 'Resource ID',
        field: 'stockNumber',
        minWidth: 300,
      }}
    />
  );
};

export default AssembliesTab;
