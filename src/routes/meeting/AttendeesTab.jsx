import { EditIcon } from '@fluentui/react-icons';
import { Box } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionsRenderer, AmbientGridTemplate, FluentTextFieldAutoComplete } from 'unity-fluent-library';
import EditAttendeesSideSheet from './EditAttendeesSideSheet';

const AttendeesTab = ({ fetchMeeting, meetingId, meetingAttendees, meetingAttendeeMeeting, open, setOpen }) => {

  const handleEdit = () => {
    setOpen(true);
  }

  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit',
        icon: EditIcon,
        onClick: handleEdit,
        disabled: false
      }
    ],
    []
  );

  const gridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      { headerName: 'Name', field: 'name', },
      { headerName: 'Type', field: 'type', },
      // { headerName: 'Company', field: 'company', },
      { headerName: 'Send Review', field: 'send_review', },
      { headerName: 'Send Minutes', field: 'send_minutes', },
      // { headerName: 'Minutes Taker', field: 'minutes_taker', },
      { headerName: 'Attended', field: 'attended', },
    ],
  };

  return (
    <>
      <AmbientGridTemplate
        title='Attendees'
        gridOptions={gridOptions}
        data={meetingAttendeeMeeting}
        // loading={loading}
        // useNewHeader
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      />
    </>
  );
};

export default AttendeesTab;

