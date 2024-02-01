import { DeleteIcon, EditIcon } from '@fluentui/react-icons';
import { Box, Accordion, Typography, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ActionsRenderer, AmbientGridTemplate, apiMutate, useAxiosGet, useUser } from 'unity-fluent-library';
import AddMeetingItemSideSheet from './AddMeetingItemSideSheet';
import MeetingItemsRenderer from './MeetingItems/MeetingItemsRenderer';
import ModalAlert from '../../UI/ModalAlert';

const MinutesTab = (props) => {
  const {
    meeting,
    setSideSheetOpen,
    setMeetingItem,
    setIsEdit,
    categories,
    refetchCategories,
    handleCategoryCreate,
    isEdit,
    selectedMeetingItem,
    meetingId,
    series,
    setMinutesOpen,
    minutesOpen,
    meetingItems,
    refetchMeetingItems,
    meetingDate
  } = props;
  const [newBusiness, setNewBusiness] = useState([]);
  const [oldBusiness, setOldBusiness] = useState([]);
  const [deleteMeetingItemOpen, setDeleteMeetingItemOpen] = useState(false);
  useEffect(() => {
    refetchMeetingItems();
  }, [meetingId]);
  useEffect(() => {
    if (!meetingItems) {
      return;
    }
    const [oldBusiness, newBusiness] = meetingItems;
    setOldBusiness(oldBusiness ?? []);
    setNewBusiness(newBusiness ?? []);
  }, [meetingItems, setOldBusiness, setNewBusiness, newBusiness, oldBusiness]);

  const deleteItem = useCallback(async () => {
    if (selectedMeetingItem) {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting_item/${selectedMeetingItem.item_id}`,
        {
          method: 'delete',
        }
      )
      if (response?.status === 204) {
        await refetchMeetingItems();
        setDeleteMeetingItemOpen(false);
      }
    }
  }, [selectedMeetingItem, refetchMeetingItems]);

  const handleEdit = (item) => {
    setIsEdit(true);
    setSideSheetOpen(true);
    setMeetingItem(item);
  }

  const handleDelete = (item) => {
    setDeleteMeetingItemOpen(true);
    setMeetingItem(item);
  }

  const actionList = useMemo(
    () => [
      {
        id: 1,
        title: 'Edit',
        icon: EditIcon,
        onClick: handleEdit,
        disabled: false
      },
      {
        id: 2,
        title: 'Delete',
        icon: DeleteIcon,
        onClick: handleDelete,
        disabled: false
      }
    ],
    []
  );

  const gridOptionsOldBusiness = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    onFirstDataRendered: function (params) {
      params.api.expandAll();
    },
    autoGroupColumnDef: {
      headerName: 'Category', 
      width: 100,
      hide: true,
    },
    groupDisplayType: 'groupRows',
    groupRowRenderer: 'agGroupCellRenderer',
    groupDefaultExpanded: 1, // Set the default number of levels to expand
    columnDefs: [
      { 
        field: 'category_title', 
        rowGroup: true, 
        hide: true,
      }, 
      {
        headerName: '#',
        field: 'item_meeting_number',
        width: 10,
      },
      {
        headerName: 'Item',
        field: 'subject',
        width: 200,
        autoHeight: true,
        wrapText: true,
        cellRenderer: 'meetingItemsRenderer',
      },
      {
        headerName: 'Due Date',
        field: 'due_date',
        width: 70,
      },
      {
        headerName: 'Priority',
        field: 'priority',
        width: 60,
      },
      {
        headerName: 'Owner',
        field: 'owner',
        width: 100,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 60,
      },
      {
        headerName: 'Actions',
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actionList,
        },
        width: 60,
        suppressMenu: true,

      },
    ]
  };

  const gridOptionsNewBusiness = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    onFirstDataRendered: function (params) {
      params.api.expandAll();
    },
    autoGroupColumnDef: {
      headerName: 'Category', 
      width: 100,
      hide: true,
    },
    groupDisplayType: 'groupRows',
    groupRowRenderer: 'agGroupCellRenderer',
    groupDefaultExpanded: 1, // Set the default number of levels to expand
    columnDefs: [
      { 
        field: 'category_title', 
        rowGroup: true, 
        hide: true,
      }, 
      {
        headerName: '#',
        field: 'item_meeting_number',
        width: 10,
      },
      {
        headerName: 'Item',
        field: 'subject',
        width: 200,
        autoHeight: true,
        wrapText: true,
        cellRenderer: 'meetingItemsRenderer',
      },
      {
        headerName: 'Due Date',
        field: 'due_date',
        width: 70,
      },
      {
        headerName: 'Priority',
        field: 'priority',
        width: 60,
      },
      {
        headerName: 'Owner',
        field: 'owner',
        width: 100,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 60,
      },
      {
        headerName: 'Actions',
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actionList,
        },
        width: 60,
        suppressMenu: true,

      },
    ]
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <ModalAlert
        open={deleteMeetingItemOpen}
        title='Delete Meeting Item'
        message='Are you sure you want to delete this meeting item?'
        action={deleteItem}
        closeAlert={() => setDeleteMeetingItemOpen(false)}
      />
      <AmbientGridTemplate
        title='Old Business'
        gridOptions={gridOptionsOldBusiness}
        animateRows='true'
        domLayout='autoHeight'
        data={oldBusiness}
        useNewHeader
        height={"calc(100vh / 3 + 56)"}
        frameworkComponents={{ actionsRenderer: ActionsRenderer, meetingItemsRenderer: MeetingItemsRenderer, }}
      />
      <AmbientGridTemplate
        title='New Business'
        height={"calc(100vh / 3)"}
        gridOptions={gridOptionsNewBusiness}
        data={newBusiness}
        useNewHeader
        domLayout='autoHeight'
        frameworkComponents={{ actionsRenderer: ActionsRenderer, meetingItemsRenderer: MeetingItemsRenderer, }}
      />
      <AddMeetingItemSideSheet
        categories={categories}
        refetchCategories={refetchCategories}
        handleCategoryCreate={handleCategoryCreate}
        isEdit={isEdit}
        selectedMeetingItem={selectedMeetingItem}
        refetchMeetingItems={refetchMeetingItems}
        meeting={meeting}
        meetingId={meetingId}
        meetingSeriesId={series?.id}
        meetingDate={meetingDate}
        open={minutesOpen}
        onClose={() => { setMinutesOpen(false) }}
      />
    </Box>
  );
};

export default MinutesTab;

