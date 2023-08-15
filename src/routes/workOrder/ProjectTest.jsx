import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { getWorkOrders, deleteWorkOrderById, getProjectsCPS } from '../../api/client';
/*CPS stuff */
import { listProjects, listArchiveProjects } from '../config/ProjectSetup/CPSProject';
// import { ProjectDataCPS } from '../../api/models';
import { useAxiosGet } from 'unity-fluent-library';
import { BasePage } from '../config/base';
import { useQuery, ApolloProvider } from '@apollo/client';
import { useFleetQuery } from '../../api/query';
import {
  OpenPage,
  PrimaryActionHeader,
  SubHeaderAction,
  SideSheet,
  AmbientCard,
  FluentSearchField,
  FluentTextField,
  FluentDialog,
  AgTable,
  useAgGridApi,
  AmbientGridTemplate,
  ActionsRenderer
} from 'unity-fluent-library';
import {
  CRMServicesIcon,
  ReportDocumentIcon,
  DeveloperToolsIcon,
} from '@fluentui/react-icons';

/* import { 
    ActionsRenderer, 
    CheckboxRenderer,
    LinkRenderer,
} from '../../components/columnRenderers'; */
/*End CPS Stuff */
/* import { WorkOrderRecord } from '../../api/models'; */


const ProjectTest = () => {
  const history = useHistory();
  const { gridApi, onGridReady } = useAgGridApi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [newData, setNewData] = useState();
  /* const projectsData = use(listProjects); */
  /* const projects = projectsData?.data?.listProjects; */

  useEffect(() => {
    /* fetch('http://cps.test/jwt/test', { */
    fetch('http://localhost:53196/api/v4/melville/getAllMMProjects', {
      method: 'GET',
      /* headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key1: 'value1',
        key2: 'value2'
      }) */
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        console.log(data);
        setNewData(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  /* const [{ data: projectsData }, refetchCurrentTenant] : any =
    useAxiosGet(
      process.env.REACT_APP_WORK_MANAGEMENT_API_BASE,
      `projects`,
      {},
      true
    ); */

  console.log("New data", newData);

  const rawBody = JSON.stringify({
    "AssetClass": "Univerus New Project",
    "AssetId": "UNP",
    "ScheduleName": "UNP123",
    "ID": 3,
    "ScheduleID": 0
  });

  const handleSubmit = () => {
    fetch('http://localhost:53196/api/v4/melville/action/insert_into_projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '+kVf+tFW2UgI/VhD1P0nRbtDNLhDaHmM'
      },
      body: rawBody
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        console.log(data);
        setNewData(data);
      })
      .catch(error => {
        console.error(error);
      });
    console.log("submitted");
  }

  const mockGridOptions = {
    defaultColDef: { resizable: true },
    columnDefs: [
      /* {
        headerName: 'Column 1',
        field: 'column1',
        resizable: true,
        sortable: true,
      }, */
      { field: 'code', headerName: 'Project #' },
      { field: 'acronym', headerName: 'Project Short Code' },
      { field: 'name', headerName: 'Project Name' },
      { field: 'address', headerName: 'Address' },
      { field: 'date_started', headerName: 'Date Started' },
      { field: 'date_completed', headerName: 'Date Completed' },
      { field: 'status', headerName: 'Status' },
      {
        field: 'actions', cellRenderer: ActionsRenderer,
        /* cellRendererParams: {
          openEditPage: enableEdit
            ? (data: RecordType) => setItemToEdit(data)
            : null,
          openDeletePage: enableDelete
            ? (data: RecordType) => setItemToDelete(data)
            : null,
          ...(rendererParams || {}),
        }, */  }
    ],
  };

  return (
    <OpenPage
      maxWidth="xl"
      disableGutters={false}
      style={{
        background: 'rgb(244, 244, 244)',
        position: 'relative',
        top: 0,
      }}
    >
      <FluentDialog
        title={'Dialog'}
        message={'Message content within the Dialog'}
        labelOne={'Acknowledge'}
        actionOne={() => setDialogOpen(false)}
        labelTwo={'Cancel'}
        actionTwo={() => setDialogOpen(false)}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
      <SideSheet
        key={'sideSheet'}
        title={'Create Project'}
        width={500}
        buttonLabel={'Create'}
        open={sideSheetOpen}
        onClose={() => setSideSheetOpen(false)}
        onSubmit={handleSubmit}
        children={
          <AmbientCard fullWidth={true} /* title={'Field Grouping'} */>
            <FluentTextField id={'textField'} label={'Project #'} />
            <FluentTextField id={'textField'} label={'Project Short Code'} />
            <FluentTextField id={'textField'} label={'Project Name'} />
            <FluentTextField id={'textField'} label={'Date Started'} />
            <FluentTextField id={'textField'} label={'Date Completed'} />
          </AmbientCard>
        }
      />
      <AmbientCard fullWidth={true}>
        <AmbientGridTemplate
          title="hello world"
          enableCreate={false}
          fetchPath="/equipment"
          onClick={console.log("Clicked")}
          /* getData={getEquipment} */
          rowData={newData}
          autoSizeToFit={true}
          //deleteItem={({ equipmentId }) => deleteEquipmentById(equipmentId)}
          /* createEditPage={CreateEditEquipment} */
          columnDefs={[
            { field: 'code', headerName: 'Project #' },
            { field: 'acronym', headerName: 'Project Short Code' },
            { field: 'name', headerName: 'Project Name' },
            { field: 'address', headerName: 'Address' },
            { field: 'date_started', headerName: 'Date Started' },
            { field: 'date_completed', headerName: 'Date Completed' },
            { field: 'status', headerName: 'Status' },
            {
              field: 'actions', cellRenderer: ActionsRenderer,
            /* cellRendererParams: {
              openEditPage: enableEdit
                ? (data: RecordType) => setItemToEdit(data)
                : null,
              openDeletePage: enableDelete
                ? (data: RecordType) => setItemToDelete(data)
                : null,
              ...(rendererParams || {}),
            }, */  }
          ]}
          //rowData={rowData}
          frameworkComponents={{ actionsRenderer: ActionsRenderer }}
        />


        {/* <AgTable
            gridOptions={mockGridOptions}
            rowData={newData}
            api={gridApi}
            onGridReady={onGridReady}
            frameworkComponents={{
                actionsRenderer: ActionsRenderer,
                checkboxRenderer: CheckboxRenderer,
                linkRenderer: LinkRenderer,
              }}
            dynamicSizing
      /> */}
      </AmbientCard>
      <SubHeaderAction>
        <PrimaryActionHeader
          title={'Projects'}
          subheader={'Meeting Minutes Active Projects'}
          buttonLabel={'New Project'}
          handleClick={() => setSideSheetOpen(true)}
          secondaryButtons={[
            {
              label: '',
              component: CRMServicesIcon,
              click: () => setDialogOpen(true),
            },
            {
              label: '',
              component: ReportDocumentIcon,
              click: () => setDialogOpen(true),
            },
            {
              label: '',
              component: DeveloperToolsIcon,
              click: () => setDialogOpen(true),
            },
          ]}
        /* search
        seachField={FluentSearchField} */
        />
      </SubHeaderAction>
    </OpenPage>
    // <BasePage<ProjectDataCPS>
    //   title="Projects"
    //   fetchPath="v1/project"
    //   getData={getProjectsCPS}
    //   createEditPage={() => <div />}
    //   /* deleteItem={({ id }) => deleteWorkOrderById(id)} */
    //   columnDefs={() => [
    //     { field: 'code', headerName: 'Project #' },
    //     { field: 'acronym', headerName: 'Project Short Code' },
    //     { field: 'name', headerName: 'Project Name' },
    //     { field: 'address', headerName: 'Address' },
    //     { field: 'dateStarted', headerName: 'Date Started' },
    //     { field: 'dateCompleted', headerName: 'Date Completed' },
    //     { field: 'status', headerName: 'Status' },
    //     /* {
    //       field: 'id',
    //       ...getActionsColumnDef({
    //         rendererParams: {
    //           openViewPage: ({ id }: WorkOrderRecord) =>
    //             history.push(`/work-order/${id}`),
    //         },
    //         width: 155,
    //       }),
    //     }, */
    //   ]}
    // />
  );
};

export default ProjectTest;
