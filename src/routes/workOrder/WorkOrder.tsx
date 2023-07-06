import React from 'react';
import { useHistory } from 'react-router-dom';

import { getWorkOrders, deleteWorkOrderById, getProjectsCPS } from '../../api/client';
/*CPS stuff */
import { listProjects, listArchiveProjects } from '../config/ProjectSetup/CPSProject';
import { ProjectDataCPS } from '../../api/models';
import { useAxiosGet } from '../../utils/useAxiosGet';
import { BasePage } from '../config/base';
import { useQuery, ApolloProvider } from '@apollo/client';
import { useFleetQuery } from '../../api/query';
/*End CPS Stuff */
/* import { WorkOrderRecord } from '../../api/models'; */


const WorkOrder = () => {
  const history = useHistory();
  /* const projectsData = use(listProjects); */
  /* const projects = projectsData?.data?.listProjects; */

  const [{ data: projectsData }, refetchCurrentTenant] : any =
    useAxiosGet(
      process.env.REACT_APP_WORK_MANAGEMENT_API_BASE,
      `projects`,
      {},
      true
    );

  return (
    <BasePage<ProjectDataCPS>
      title="Projects"
      fetchPath="v1/project"
      getData={getProjectsCPS}
      createEditPage={() => <div />}
      /* deleteItem={({ id }) => deleteWorkOrderById(id)} */
      columnDefs={() => [
        { field: 'code', headerName: 'Project #' },
        { field: 'acronym', headerName: 'Project Short Code' },
        { field: 'name', headerName: 'Project Name' },
        { field: 'address', headerName: 'Address' },
        { field: 'dateStarted', headerName: 'Date Started' },
        { field: 'dateCompleted', headerName: 'Date Completed' },
        { field: 'status', headerName: 'Status' },
        /* {
          field: 'id',
          ...getActionsColumnDef({
            rendererParams: {
              openViewPage: ({ id }: WorkOrderRecord) =>
                history.push(`/work-order/${id}`),
            },
            width: 155,
          }),
        }, */
      ]}
    />
  );
};

export default WorkOrder;
