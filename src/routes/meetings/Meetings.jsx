import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AmbientGridTemplate, useUser, ActionsRenderer, PrimaryActionButton, apiMutate } from 'unity-fluent-library';
import {
  AssignIcon,
  ContactIcon,
  EditIcon,
  AddIcon,
} from '@fluentui/react-icons';
import { Typography } from '@material-ui/core';

const Meetings = (props) => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingSeriesId, setMeetingSeriesId] = useState(params?.meetingSeriesId || null);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_group/${meetingSeriesId}/full`,
        {
          method: "GET"
        });
      setMeetings(response.data.cpsMeeting_groupCpsMeeting);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [])

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
      actionsCellRenderer: ActionsRenderer,
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      { headerName: 'Title', field: 'title', },
      { headerName: 'Meeting #', field: 'meeting_number', },
      { headerName: 'Date', field: 'date', },
      { headerName: 'Location', field: 'location', },
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

  const addMeetingButton = (
    <PrimaryActionButton>
      <Typography>Add</Typography>
      <AddIcon />
    </PrimaryActionButton>
  )

  return (
    <AmbientGridTemplate
      title='Meetings'
      primaryActionButton={addMeetingButton}
      gridOptions={gridOptions}
      data={meetings}
      loading={loading}
      hideGroupTab
      hideColumnTab
      frameworkComponents={{ actionsRenderer: ActionsRenderer }}
    />
  );
};

export default Meetings;
