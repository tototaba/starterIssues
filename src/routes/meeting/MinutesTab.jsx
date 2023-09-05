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

  const fetchMeetingItems = async () => {
    try {
      const response = await apiMutate(
        REACT_APP_PRODUCTIVITY_API_BASE,
        "cpsmeeting_item",
        {
          method: "GET"
        });
      setMeetingItems(response.data)
      const formattedDates = response.data.map(item => {
        return {
          ...item,
          due_date: new Date(item.due_date).toLocaleDateString(),
        }
      })
      const newBusiness = [];
      const oldBusiness = [];

      formattedDates.forEach(item => {
        if (item.meeting_created === meeting?.id && item.group_id === meeting?.group_id) {
          newBusiness.push(item);
        } else if (item.group_id === meeting?.group_id && new Date(item.open_date) < new Date(meeting?.date)) {
          oldBusiness.push(item);
        }
      });
      setNewBusiness(newBusiness);
      setOldBusiness(oldBusiness);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    fetchMeetingItems();
  }, [meeting])

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

