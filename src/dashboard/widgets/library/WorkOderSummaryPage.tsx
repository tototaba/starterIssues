import React, { forwardRef } from 'react';
import { EditIcon } from '@fluentui/react-icons';
import {
  PrimaryActionHeader,
  SubHeaderAction,
} from 'unity-fluent-library';

import SummaryTab from '../../../routes/workOrder/ui/SummaryTab';
import { useFleetQuery } from '../../../api/query';
import { getWorkOrderById, getWorkOrderHistory } from '../../../api/client';

/**
 * @param props
 * @param ref
 * @returns
 */
const WorkOrderSummaryPage = (props: any, ref: any) => {
  const { params, ...other } = props;

  const workOrderId: number = params.contentId;

  // Main work order data
  const { result: workOrder, error: fetchWOError } = useFleetQuery(
    ['/workorder', workOrderId],
    () => getWorkOrderById(workOrderId)
  );

  // Work order history
  const { result: workOrderHistory, error: fetchHistoryError } = useFleetQuery(
    ['/workorder', workOrderId, '/history'],
    () => getWorkOrderHistory(workOrderId, { limit: 100 })
  );

  return (
    <>
      <SubHeaderAction>
        <PrimaryActionHeader
          title={workOrder?.workOrderName || ''}
          buttonLabel="Edit Work Order"
          handleClick={() => { }}
          icon={<EditIcon style={{ fontSize: 16 }} />}
          tabs
        />
      </SubHeaderAction>
      <SummaryTab
        workOrderId={workOrderId}
        workOrder={workOrder}
        eventHistory={workOrderHistory}
        goToFinancialSummary={() => { }}
      />
    </>
  );
};

export default forwardRef(WorkOrderSummaryPage);
