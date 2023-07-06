/**
 * NOTE: this is a temporary route for debugging/development purposes
 */

import React from 'react';
import { useHistory } from 'react-router-dom';

import { getEstimates, deleteEstimateById } from '../../api/client';
import { WorkOrderEstimateRecord } from '../../api/models';
import { BasePage } from '../config/base';

const Estimate = () => {
  const history = useHistory();

  return (
    <BasePage<WorkOrderEstimateRecord>
      title="Estimates"
      fetchPath="/estimate"
      getData={getEstimates}
      createEditPage={() => <div />}
      deleteItem={({ id }) => deleteEstimateById(id)}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'estimateName', headerName: 'Name' },
        {
          field: 'id',
          ...getActionsColumnDef({
            rendererParams: {
              openViewPage: ({ id }: WorkOrderEstimateRecord) =>
                history.push(`/estimate/${id}`),
            },
            width: 155,
          }),
        },
      ]}
    />
  );
};

export default Estimate;
