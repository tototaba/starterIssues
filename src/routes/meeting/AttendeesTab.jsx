import { EditIcon } from '@fluentui/react-icons';
import { Box } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { ActionsRenderer, AmbientGridTemplate } from 'unity-fluent-library';

const AttendeesTab = ({ attendees }) => {
  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit',
        icon: EditIcon,
        // onClick: handleEdit,
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
      { headerName: 'Name', field: 'name', },
      { headerName: 'Type', field: 'type', },
      // { headerName: 'Company', field: 'company', },
      { headerName: 'Send Review', field: 'send_review', },
      { headerName: 'Send Minutes', field: 'send_minutes', },
      // { headerName: 'Minutes Taker', field: 'minutes_taker', },
      { headerName: 'Attended', field: 'attended', },
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


  return (
    <AmbientGridTemplate
      title='Attendees'
      // primaryActionButton={addMeetingSeriesButton}
      gridOptions={gridOptions}
      data={attendees}
      // loading={loading}
      // useNewHeader
      frameworkComponents={{ actionsRenderer: ActionsRenderer }}
    />
  );
};

export default AttendeesTab;

