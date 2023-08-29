import { useSnackbar } from 'notistack';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AmbientGridTemplate,
  useUser,
  ActionsRenderer,
  PrimaryActionButton,
  apiMutate,
  useAgGridApi
} from 'unity-fluent-library';
import {
  AssignIcon,
  ContactIcon,
  EditIcon,
  AddIcon,
} from '@fluentui/react-icons';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const MeetingSeries = (props) => {
  const { params, ...other } = props;
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const successAction = getSuccessAction(closeSnackbar);
  const [meetingSeries, setMeetingSeries] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [numMeetings, setNumMeetings] = useState(0);
  const { gridApi, onGridReady } = useAgGridApi();
  const [selectedRow, setSelectedRow] = useState();
  const history = useHistory();
  const user = useUser();

  const fetchMeetingSeries = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_group`,
        {
          method: "GET"
        });
      setMeetingSeries(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const countNumMeetings = () => {
    meetingSeries.forEach((ms) => {
      ms['meetings_in_series'] = 0;
      meetings.forEach((m) => {
        if (ms.id == m.group_id) {
          ms['meetings_in_series'] = ms['meetings_in_series'] + 1;
        }
      })
    });
    console.log(meetingSeries);
  }

  const fetchMeetings = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting`,
        {
          method: "GET"
        });
      setMeetings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMeetingSeries();
    fetchMeetings();
    countNumMeetings();
  }, [])

  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit Meeting Series',
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
      actionsCellRenderer: ActionsRenderer,
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      { headerName: 'Meeting Series id', field: 'id', },
      { headerName: 'Title', field: 'name', },
      { headerName: 'Meetings in Series', field: 'meetings_in_series', },
      { headerName: 'Date', field: 'date', },
      { headerName: 'Open Items', field: 'open_items', },
      { headerName: 'Draft Sent', field: 'draft_sent', },
      { headerName: 'Final Sent', field: 'final_sent', },
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

  const handleRowSelected = useCallback(
    event => {
      let selectedMeetingSeries = event.data;
      if (selectedMeetingSeries) {
        history.push(`/meetings/${selectedMeetingSeries.id}`)
      }
    },
    [gridApi, history]
  );

  const addMeetingSeriesButton = (
    <PrimaryActionButton>
      <Typography>Add</Typography>
      <AddIcon />
    </PrimaryActionButton>
  );

  return (
    <AmbientGridTemplate
      title='Meeting Series'
      primaryActionButton={addMeetingSeriesButton}
      gridOptions={gridOptions}
      onRowSelected={handleRowSelected}
      onRowClicked={handleRowSelected}
      rowSelection="single"
      data={meetingSeries}
      loading={loading}
      api={gridApi}
      hideGroupTab
      hideColumnTab
      frameworkComponents={{ actionsRenderer: ActionsRenderer }}
    />
  );
};

export default MeetingSeries;
