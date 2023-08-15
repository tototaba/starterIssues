import { useSnackbar } from 'notistack';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AmbientGridTemplate, useUser, ActionsRenderer, PrimaryActionButton } from 'unity-fluent-library';
import {
  AssignIcon,
  ContactIcon,
  EditIcon,
  AddIcon,
} from '@fluentui/react-icons';
import { Typography } from '@material-ui/core';
// import { AmbientGridTemplate, useUser } from 'unity-fluent-library';
// import ActionsRenderer from '../../../components/ui/grid/ActionsRenderer';

export const mockData = [
  {
    id: 30,
    title: 'Cameron Meeting',
    meetings_in_series: 2,
    date: '2023-08-10',
    open_items: 1,
    draft_sent: 'No',
    final_sent: 'No',
  },
  {
    id: 31,
    title: 'Star Series',
    meetings_in_series: 3,
    date: '2023-06-22',
    open_items: 2,
    draft_sent: 'Yes',
    final_sent: 'No',
  }
]

const MeetingSeries = (props: any) => {
  const { params, ...other } = props;
  const [loading, setLoading] = useState(false);
  const [handleModal, setHandleModal] = useState({
    editMeeting: false,
    updateItemForm: false,
    manageMeetingObservers: false,
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: '',
    message: '',
    confirm: false,
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const successAction = getSuccessAction(closeSnackbar);
  const [meetingSeries, setMeetingSeries] = useState([]);
  // const 
  // const user = useUser();

  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit Meeting',
        icon: EditIcon,
        // onClick: handleEdit,
        disabled: false
      },
      {
        id: 2, // Must be unique
        title: 'Update Item Form',
        icon: AssignIcon,
        // onClick: handleUpdate,
        disabled: false
      },

      {
        id: 3, // Must be unique
        title: 'Manage Meeting Observers',
        icon: ContactIcon,
        // onClick: handleManage,
        disabled: false
      }
    ],
    []

  );

  const gridOptions = {
    frameworkComponents: {
      //activeCheckmarkRenderer: ActiveCheckmarkRenderer,
      //activeRenderer: ActiveRenderer,
      actionsCellRenderer: ActionsRenderer,
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      {
        headerName: 'Meeting Series id',
        field: 'id',
      },
      {
        headerName: 'Title',
        field: 'title',
      },
      {
        headerName: 'Meetings in Series',
        field: 'meetings_in_series',
      },
      {
        headerName: 'Date',
        field: 'date',
      },
      {
        headerName: 'Open Items',
        field: 'open_items',
      },
      {
        headerName: 'Draft Sent',
        field: 'draft_sent',
      },
      {
        headerName: 'Final Sent',
        field: 'final_sent',
      },
      {

        headerName: 'Actions',
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actionList
        },
        suppressMenu: true,
      }
    ],
  };

  const addMeetingSeriesButton = (
    <PrimaryActionButton>
      <Typography>Add</Typography>
      <AddIcon />
    </PrimaryActionButton>
  )
  
  return (
    <AmbientGridTemplate
      title='Meeting Series'
      primaryActionButton={addMeetingSeriesButton}
      gridOptions={gridOptions}
      // columnDefs={columnDefs}
      data={mockData}
      loading={loading}
      hideGroupTab
      hideColumnTab
      frameworkComponents={{ actionsRenderer: ActionsRenderer }}
    />
  );
};

export default MeetingSeries;
