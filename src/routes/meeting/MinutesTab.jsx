import { EditIcon } from '@fluentui/react-icons';
import { Box, Accordion } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionsRenderer, AmbientGridTemplate, apiMutate, useAxiosGet, useUser } from 'unity-fluent-library';

const MinutesTab = (props) => {
  const {
    meeting,
    oldBusiness,
    newBusiness,
  } = props;
  const user = useUser();

  // console.log(oldBusiness);
  // console.log(newBusiness);

  // const [
  //   { data: meetingItems},
  //   refetchMeetingItems
  // ] = useAxiosGet(
  //   `https://localhost:44371/ProductivityService/api/v1`,
  //   `cpsmeeting_item`,
  //   {},
  //   !!user,
  //   false
  // )

  const actionList = useMemo(
    () => [
      {
        id: 1,
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
      // { headerName: '#', field: 'item_number', },
      { headerName: 'Item', field: 'subject', },
      { headerName: 'Due Date', field: 'due_date', },
      { headerName: 'Priority', field: 'priority', },
      { headerName: 'Owner', field: 'created_by', },
      // { headerName: 'Status', field: 'status', },
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <AmbientGridTemplate
        title='Old Business'
        // primaryActionButton={addMeetingSeriesButton}
        gridOptions={gridOptions}
        animateRows='true'
        domLayout='autoHeight'
        data={oldBusiness}
        // loading={meetingItemsLoading}
        // useNewHeader
        height={"calc(100vh / 3 + 56)"}
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      />
      <AmbientGridTemplate
        title='New Business'
        height={"calc(100vh / 3)"}
        // primaryActionButton={addMeetingSeriesButton}
        gridOptions={gridOptions}
        data={newBusiness}
        domLayout='autoHeight'
        // loading={loading}
        // useNewHeader
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      />
    </Box>
  );
};

export default MinutesTab;

