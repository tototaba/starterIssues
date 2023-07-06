import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent, useTheme } from '@material-ui/core';
import {
  FluentSimpleTab,
  FluentSimpleTabs,
  GridRow,
  GridUnit,
  OpenPage,
  PrimaryActionHeader,
  SubHeaderAction,
} from 'unity-fluent-library';
import { useParams } from 'react-router-dom';

import { useFleetQuery } from '../../../api/query';
import {
  getEstimateById,
  getWorkOrderFinancialSummary,
  getWorkOrderEstimateConstructionUnit,
} from '../../../api/client';
import formatCurrency from '../../../utils/formatCurrency';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { ListCard, ListElement } from '../../../components/ListCard';
import FullHeightCard from '../../../components/FullHeightCard';
import AssembliesTab from '../ui/AssembliesTab';

const MapView = lazy(() => import('../../../components/map/MapView'));

const EstimateView = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const params = useParams<{ id: string }>();
  const estimateId = parseInt(params.id, 10);

  // Main esimate data
  const { result: estimate, error: fetchEstimateError } = useFleetQuery(
    ['/estimate', estimateId],
    () => getEstimateById(estimateId)
  );

  // Work order financial summary
  const { result: financialSummary, error: fetchFinancialSummaryError } =
    useFleetQuery(
      ['/workorder', estimate?.workOrderId, '/financialsummary'],
      () => getWorkOrderFinancialSummary(estimate?.workOrderId!),
      { enabled: estimate?.workOrderId !== undefined }
    );

  const tableParams = { limit: 100 };
  const { result: constructionUnits, error: fetchTableError } = useFleetQuery(
    ['/workorder', estimate?.workOrderId, '/estimate', estimateId, tableParams],
    () =>
      getWorkOrderEstimateConstructionUnit(
        estimate?.workOrderId!,
        estimateId,
        tableParams
      ),
    { enabled: estimate?.workOrderId !== undefined }
  );

  let fetchError =
    fetchEstimateError || fetchTableError || fetchFinancialSummaryError;

  if (fetchError) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={fetchError!} // TODO: remove ! once typescript is updated
      />
    );
  }

  const estimateList = [
    { label: 'Estimate 1' },
    { label: 'Estimate 2' },
    { label: 'Estimate 3' },
    { label: 'Estimate 4' },
  ];

  const tabList = [
    { label: 'Assemblies' },
    { label: 'All Resources' },
    { label: 'Design' },
  ];

  return (
    <OpenPage disableGutters>
      <SubHeaderAction>
        <PrimaryActionHeader
          title={estimate?.estimateName || ''}
          // buttonLabel="Edit Estimate"
          // handleClick={() => {}}
          // icon={<EditIcon style={{ fontSize: 16 }} />}
          handleChange={(event: any, tab: number) => setCurrentTab(tab)}
          value={currentTab}
          tabList={estimateList}
          tabs
        />
      </SubHeaderAction>

      <GridRow highlight>
        <GridUnit ratio="3:2" width={theme.spacing(56)}>
          {estimate && (
            <FullHeightCard
              title={estimate.estimateName}
              status="warning"
              label={estimate.workOrderStatus ?? ''}
              adornment="warning"
              button={estimate.estimateApprovable ? 'Approve' : 'Unapprove'}
              // TODO
              onClick={() => {}}
              // customAdornment={false}
              // fullWidth
            >
              {estimate.estimateDescription}
            </FullHeightCard>
          )}
        </GridUnit>

        <GridUnit ratio="3:2" width={theme.spacing(56)}>
          {estimate && (
            <ListCard>
              {[
                ['Estimate ID', estimate.id],
                ['Line', estimate.condition],
                [
                  'Total Projected Cost',
                  formatCurrency(estimate.estimatedTotal),
                ],
                [
                  'Spend to Date',
                  financialSummary?.totalSpend !== undefined
                    ? formatCurrency(financialSummary.totalSpend)
                    : '',
                ],
              ].map(([k, v]) => (
                <ListElement subject={k} value={v} />
              ))}
            </ListCard>
          )}
        </GridUnit>

        <GridUnit ratio="3:2" width={theme.spacing(55)}>
          <Card elevation={0} style={{ height: '100%' }}>
            <CardContent style={{ height: '100%' }}>
              <Suspense fallback={<div>Loading...</div>}>
                <MapView />
              </Suspense>
            </CardContent>
          </Card>
        </GridUnit>
      </GridRow>

      <FluentSimpleTabs
        value={0}
        onChange={() => {}}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabList &&
          tabList.map((item, index) => {
            return (
              <FluentSimpleTab
                key={item.label}
                label={item.label}
                // {...a11yProps(index)}
              />
            );
          })}
      </FluentSimpleTabs>

      {constructionUnits && (
        <AssembliesTab constructionUnits={constructionUnits} />
      )}
    </OpenPage>
  );
};

export default EstimateView;
