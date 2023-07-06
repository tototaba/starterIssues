import React, { useState } from 'react';
import { EditIcon } from '@fluentui/react-icons';
import { useParams } from 'react-router-dom';
import {
  OpenPage,
  PrimaryActionHeader,
  SubHeaderAction,
} from 'unity-fluent-library';

import { useFleetQuery } from '../../../api/query';
import { getWorkOrderById, getWorkOrderHistory } from '../../../api/client';
import ErrorDisplay from '../../../components/ErrorDisplay';
import EventTimeline from '../../../components/EventTimeline';
import FinancialTab from '../ui/FinancialTab';
import SummaryTab from '../ui/SummaryTab';

const tabList = [
  { label: 'Summary' },
  { label: 'History' },
  { label: 'Financial' },
  { label: 'Engineering' },
  { label: 'Capitalization' },
];

const WorkOrderView = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const params = useParams<{ id: string }>();
  const workOrderId = parseInt(params.id, 10);

  // Main work order data
  const { result: workOrder, error: fetchWOError } = useFleetQuery(
    ['/workorder', workOrderId],
    () => getWorkOrderById(workOrderId)
  );

  // Work order history
  const { result: history, error: fetchHistoryError } = useFleetQuery(
    ['/workorder', workOrderId, '/history'],
    () => getWorkOrderHistory(workOrderId, { limit: 100 })
  );

  let fetchError = fetchWOError || fetchHistoryError;

  if (fetchError) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={fetchError!} // TODO: remove ! once typescript is updated
      />
    );
  }

  return (
    <OpenPage disableGutters>
      <SubHeaderAction>
        <PrimaryActionHeader
          title={workOrder?.workOrderName || ''}
          buttonLabel="Edit Work Order"
          handleClick={() => {}}
          icon={<EditIcon style={{ fontSize: 16 }} />}
          handleChange={(event: any, tab: number) => setCurrentTab(tab)}
          value={currentTab}
          tabList={tabList}
          tabs
        />
      </SubHeaderAction>

      {tabList[currentTab].label === 'Summary' && (
        <SummaryTab
          workOrderId={workOrderId}
          workOrder={workOrder}
          eventHistory={history}
          goToFinancialSummary={() =>
            setCurrentTab(
              tabList.findIndex(({ label }) => label === 'Financial')
            )
          }
        />
      )}

      {tabList[currentTab].label === 'Financial' && (
        <FinancialTab workOrder={workOrder} />
      )}

      {tabList[currentTab].label === 'History' && history && (
        <EventTimeline events={history} />
      )}
    </OpenPage>
  );
};

export default WorkOrderView;
