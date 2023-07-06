import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
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
import { FormikPickerField } from '../../../components/fields/PickerField';
import { Grid } from '@material-ui/core';
import Picker from '../../../components/picker/Picker';


import { AssemblyRecord, SubassemblyRecord } from '../../../api/models';
import { BasePage, BasePageProps, CreateEditPageProps } from '../base';
import { mockGridOptions, mockRowData } from '../../../mockData/mockData';

export interface ConstructionUnitsViewProps<RecordType>
  extends Pick<
  BasePageProps<RecordType>,
  'getData' | 'deleteItem' | 'renderSubHeaderActions'
  > {
  name: string;
  fetchPath: string;
  createEditPage: React.ComponentType<CreateEditPageProps<RecordType>>;
}

const ConstructionUnitsView = () => {
const history = useHistory();
const { gridApi, onGridReady } = useAgGridApi();
const [dialogOpen, setDialogOpen] = useState(false);
const [sideSheetOpen, setSideSheetOpen] = useState(false);
const [newData, setNewData] = useState();

useEffect(() => {
  fetch('http://localhost:53196/api/v4/melville/getAllMMMeetingGroups', {
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

  console.log("New data", newData);

  const rawBody = JSON.stringify({
    "ID": 3,
    "AssetClass": "Univerus Meeting Group",
    "AssetId": "Status",
    "ScheduleName": "Microsoft Teams",
});

  const handleSubmit = () => {
      fetch('http://localhost:53196/api/v4/melville/action/insert_into_meeting_groups', {
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
      { field: 'actions', cellRenderer: ActionsRenderer,
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
          <FluentTextField id={'textField'} label={'Title'} />
          <FluentTextField id={'textField'} label={'Meeting #'} />
          <FluentTextField id={'textField'} label={'Date'} />
          <FluentTextField id={'textField'} label={'Location'} />
        </AmbientCard>
      }
    />
  <AmbientCard fullWidth={true}>
  <AmbientGridTemplate
        title="Active Meeting-Series"
        enableCreate={false}
        fetchPath="/equipment"
        /* getData={getEquipment} */
        rowData={newData}
        autoSizeToFit={true}
        //deleteItem={({ equipmentId }) => deleteEquipmentById(equipmentId)}
        /* createEditPage={CreateEditEquipment} */
        columnDefs={[
          { field: 'title', headerName: 'Title' },
          { field: 'meeting_number', headerName: 'Meeting #' },
          { field: 'date', headerName: 'Date' },
          { field: 'location', headerName: 'Location' },
          { field: 'start_time', headerName: 'Draft Sent' },
          { field: 'end_time', headerName: 'Final Sent' },
          { field: 'actions', headerName: 'Actions', cellRenderer: ActionsRenderer },
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
          title={'Meeting-Series'}
          subheader={'Active Meeting-Series'}
          buttonLabel={'New Meeting'}
          handleClick={() => setSideSheetOpen(true)}
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

export default ConstructionUnitsView;
