import React, { Suspense, lazy } from 'react';
import { ArrowTallUpRightIcon, DateTimeIcon } from '@fluentui/react-icons';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  AmbientCard,
  FluentIcon,
  FluentIconButton,
  GridRow,
  GridUnit,
  StatusChip,
} from 'unity-fluent-library';

import { useFleetQuery } from '../../../api/query';
import {
  getWorkOrderEstimateSummary,
  getWorkOrderFinancialSummary,
} from '../../../api/client';
import { WorkOrderRecord, EventRecord } from '../../../api/models';
import formatCurrency from '../../../utils/formatCurrency';
import ErrorDisplay from '../../../components/ErrorDisplay';
import HorizontalBarChart from '../../../components/HorizontalBarChart';
import { ListCard, ListElement } from '../../../components/ListCard';
import FullHeightCard from '../../../components/FullHeightCard';

const MapView = lazy(() => import('../../../components/map/MapView'));

interface SummaryTabProps {
  workOrderId: number;
  workOrder: WorkOrderRecord | undefined;
  eventHistory: EventRecord[] | undefined;
  goToFinancialSummary: () => void;
}

const SummaryTab = ({
  workOrderId,
  workOrder,
  eventHistory,
  goToFinancialSummary,
}: SummaryTabProps) => {
  const theme = useTheme();
  const history = useHistory();

  // Work order estimate summary
  const { result: estimate, error: fetchEstimateError } = useFleetQuery(
    ['/workorder', workOrderId, '/estimate'],
    () => getWorkOrderEstimateSummary(workOrderId, workOrder?.estimateId!),
    {
      enabled:
        !!workOrder &&
        workOrder.estimateId !== null &&
        workOrder.estimateId !== undefined,
    }
  );

  // Work order financial summary
  const { result: financialSummary, error: fetchFinancialSummaryError } =
    useFleetQuery(['/workorder', workOrderId, '/financialsummary'], () =>
      getWorkOrderFinancialSummary(workOrderId)
    );

  let fetchError = fetchEstimateError || fetchFinancialSummaryError;

  if (fetchError) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={fetchError!} // TODO: remove ! once typescript is updated
      />
    );
  }

  return (
    <>
      <GridRow highlight>
        <GridUnit ratio="3:2" width={theme.spacing(60)}>
          {workOrder && (
            <AmbientCard
              title={workOrder.workOrderName}
              status="warning"
              label={workOrder.workOrderStatus}
            >
              {workOrder.workOrderDescription}
            </AmbientCard>
          )}
        </GridUnit>

        <GridUnit ratio="3:2" width={theme.spacing(60)}>
          {workOrder && (
            <ListCard>
              {[
                ['Utility Type Code', workOrder.utilityTypeCode],
                ['Work Order #', workOrder.workOrderNumber],
                ['Work Order Class', workOrder.workOrderClass],
                ['District', workOrder.districtCode],
                ['Warehouse', workOrder.warehouseCode],
                ['Project', workOrder.projectName],
                [
                  'Type',
                  <StatusChip status="info" label={workOrder.workOrderType} />,
                ],
              ].map(([k, v]) => (
                <ListElement style={{ width: '50%' }} subject={k} value={v} />
              ))}
            </ListCard>
          )}
        </GridUnit>

        <GridUnit ratio="3:2" width={theme.spacing(60)}>
          <Card elevation={0} style={{ height: '100%' }}>
            <CardContent style={{ height: '100%' }}>
              <Suspense fallback={<div>Loading...</div>}>
                <MapView />
              </Suspense>
            </CardContent>
          </Card>
        </GridUnit>
      </GridRow>

      <GridRow>
        <GridUnit ratio="4:3" width={theme.spacing(65)}>
          <FullHeightCard
            title={estimate?.estimateName ?? ''}
            status="error"
            adornment="warning"
            label={workOrder?.condition ?? ''}
            button="View Estimate"
            onClick={() => history.push(`/estimate/${estimate?.estimateId}`)}
            // customAdornment={false}
            // fullWidth
          >
            {estimate && (
              <>
                <HorizontalBarChart
                  values={[
                    { name: 'Labor', amount: estimate.estimatedLaborTotal },
                    {
                      name: 'Equipment',
                      amount: estimate.estimatedEquipmentTotal,
                    },
                    {
                      name: 'Inventory',
                      amount: estimate.estimatedMaterialTotal,
                    },
                    {
                      name: 'Contribution',
                      amount: estimate.estimatedContributionTotal,
                    },
                    { name: 'Other', amount: estimate.estimatedOtherTotal },
                  ]}
                />

                <Typography style={{ marginTop: 12 }}>
                  {estimate.estimateDescription}
                </Typography>
              </>
            )}
          </FullHeightCard>
        </GridUnit>

        <GridUnit ratio="4:3" width={theme.spacing(65)}>
          <FullHeightCard
            title="Financial Summary"
            button="View Financial Summary"
            onClick={() => goToFinancialSummary()}
          >
            {[
              [
                'Total Estimate',
                estimate?.estimatedTotal !== undefined
                  ? formatCurrency(estimate.estimatedTotal)
                  : '',
              ],
              [
                'Spend To Date',
                financialSummary?.totalSpend !== undefined
                  ? formatCurrency(financialSummary.totalSpend)
                  : '',
              ],
            ].map(([k, v]) => (
              <ListElement subject={k} value={v} />
            ))}
          </FullHeightCard>
        </GridUnit>

        <GridUnit ratio="4:3" width={theme.spacing(65)}>
          <FullHeightCard
            title="Scheduling"
            button="View Scheduling"
            // fullWidth
          >
            <Grid
              container
              direction="column"
              spacing={2}
              style={{ width: '100%', height: '100%' }}
            >
              {eventHistory &&
                eventHistory.slice(0, 3).map(({ eventDate, eventType }) => (
                  <Grid item container spacing={2} alignItems="center">
                    <Grid item xs="auto">
                      <Avatar
                        style={{
                          color: '#0F62FE',
                          border: 'solid 2px #0F62FE',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <FluentIcon component={DateTimeIcon} />
                      </Avatar>
                    </Grid>

                    <Grid item xs container direction="column">
                      <Grid
                        item
                        style={{ fontSize: 12, color: '#666', marginBottom: 2 }}
                      >
                        {eventType}
                      </Grid>

                      <Grid item style={{ fontSize: 14 }}>
                        {eventDate
                          ? new Date(eventDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : ''}
                      </Grid>
                    </Grid>

                    <Grid item xs="auto">
                      <FluentIconButton icon={ArrowTallUpRightIcon} />
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </FullHeightCard>
        </GridUnit>
      </GridRow>
    </>
  );
};

export default SummaryTab;
