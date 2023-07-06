import React, { useMemo } from 'react';
import { ColDef } from '@ag-grid-community/core';
import {
  AmbientCard,
  AmbientGridTemplate,
  GridRow,
  GridUnit,
} from 'unity-fluent-library';

import { useFleetQuery } from '../../../api/query';
import {
  getWorkOrderEstimateToActualSummary,
  getWorkOrderEstimateToActualDetail,
} from '../../../api/client';
import {
  WorkOrderEstimateToActualDetailRecord,
  WorkOrderRecord,
} from '../../../api/models';
import formatCurrency from '../../../utils/formatCurrency';
import ErrorDisplay from '../../../components/ErrorDisplay';

interface FinancialTabProps {
  workOrder: WorkOrderRecord | undefined;
}

const FinancialTab = ({ workOrder }: FinancialTabProps) => {
  const { result: estimateToActualSummary, error } = useFleetQuery(
    ['/workorder', workOrder?.id, '/estimatetoactualsummary'],
    () => getWorkOrderEstimateToActualSummary(workOrder?.id!),
    { enabled: workOrder?.id !== undefined }
  );

  const tableParams = { limit: 100 };
  const { result: estimateToActualDetail, error: error2 } = useFleetQuery(
    ['/workorder', workOrder?.id, '/estimatetoactualdetail', tableParams],
    () => getWorkOrderEstimateToActualDetail(workOrder?.id!, tableParams),
    { enabled: workOrder?.id !== undefined }
  );

  const totalRow = useMemo(() => {
    const totals = {
      estimatedTotal: 0,
      actualTotal: 0,
      variance: 0,
    };

    if (estimateToActualDetail) {
      estimateToActualDetail.forEach(
        ({ estimatedTotal = 0, actualTotal = 0, variance = 0 }) => {
          totals.estimatedTotal += estimatedTotal;
          totals.actualTotal += actualTotal;
          totals.variance += variance;
        }
      );
    }

    return totals;
  }, [estimateToActualDetail]);

  if (error || error2) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={(error || error2)!} // TODO: remove ! once typescript is updated
      />
    );
  }

  const columnDefs: (ColDef & {
    field?: keyof WorkOrderEstimateToActualDetailRecord;
  })[] = [
    { field: 'transactionType', headerName: 'Type' },
    { field: 'resourceCode', headerName: 'Resource ID' },
    { field: 'description', headerName: 'Description' },
    { field: 'uom', headerName: 'UOM' },
    {
      field: 'estimatedQuantity',
      type: 'rightAligned',
      headerName: 'Est. Qty',
    },
    {
      field: 'estimatedRate',
      headerName: 'Est. Rate',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    {
      field: 'estimatedTotal',
      headerName: 'Est. Total',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    { field: 'actualQuantity', type: 'rightAligned', headerName: 'Actual Qty' },
    {
      field: 'actualRate',
      headerName: 'Actual Rate',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    {
      field: 'actualTotal',
      headerName: 'Actual Total',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
    },
    {
      field: 'variance',
      headerName: 'Variance',
      type: 'rightAligned',
      valueFormatter: ({ value }) => formatCurrency(value),
      cellStyle: ({ value }) => ({
        backgroundColor: value >= 0 ? '#f1f8f0' : '#fff0ef',
      }),
    },
  ];

  return (
    <>
      <GridRow highlight>
        {estimateToActualSummary &&
          [
            {
              title: 'Inventory',
              estimate: estimateToActualSummary.estimatedMaterialTotal,
              actual: estimateToActualSummary.actualMaterialTotal,
            },
            {
              title: 'Labor',
              estimate: estimateToActualSummary.estimatedLaborTotal,
              actual: estimateToActualSummary.actualLaborTotal,
            },
            {
              title: 'Equipment',
              estimate: estimateToActualSummary.estimatedEquipmentTotal,
              actual: estimateToActualSummary.actualEquipmentTotal,
            },
            {
              title: 'Contribution',
              estimate: estimateToActualSummary.estimatedContributionTotal,
              actual: estimateToActualSummary.actualContributionTotal,
            },
            {
              title: 'Other',
              estimate: estimateToActualSummary.estimatedOtherTotal,
              actual: estimateToActualSummary.actualOtherTotal,
            },
          ].map(({ title, estimate, actual }) => {
            const isLessThanEstimate = (actual || 0) <= (estimate || 0);

            return (
              <GridUnit ratio="2:1">
                <AmbientCard
                  title={title}
                  fullWidth
                  adornment={isLessThanEstimate ? 'success' : 'error'}
                  customAdornment={false}
                >
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ height: '100%', flex: 1, padding: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 200 }}>
                        {formatCurrency(estimate)}
                      </div>
                      <div style={{ fontSize: 12 }}>Estimate</div>
                    </div>

                    <div
                      style={{
                        height: '100%',
                        flex: 1,
                        padding: 8,
                        backgroundColor: isLessThanEstimate
                          ? '#f1f8f0'
                          : '#fff0ef',
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 200 }}>
                        {formatCurrency(actual)}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: isLessThanEstimate ? '#3B873E' : '#E31B0C',
                        }}
                      >
                        Actual
                      </div>
                    </div>
                  </div>
                </AmbientCard>
              </GridUnit>
            );
          })}
      </GridRow>

      {estimateToActualDetail && (
        <AmbientGridTemplate
          title="Financial Summary"
          data={estimateToActualDetail}
          columnDefs={columnDefs}
          getRowStyle={({ node }: any) =>
            node.rowPinned ? { 'font-weight': 'bold' } : null
          }
          pinnedBottomRowData={[totalRow]}
        />
      )}
    </>
  );
};

export default FinancialTab;
