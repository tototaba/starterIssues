import { DeleteIcon, EditIcon } from '@fluentui/react-icons';
import {
  Box,
  LinearProgress, //this will be import from the unity-fluent-library, when we have a wrapper
} from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActionsRenderer,
  AmbientGridTemplate,
  apiMutate,
} from 'unity-fluent-library';
import AddMeetingItemSideSheet from './AddMeetingItemSideSheet';
import MeetingItemsRenderer from './MeetingItems/MeetingItemsRenderer';
import ModalAlert from '../../UI/ModalAlert';
import { useTranslation } from 'react-i18next';

const MinutesTab = props => {
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
    fetchDataLoading,
    meetingDate,
  } = props;
  const [newBusiness, setNewBusiness] = useState([]);
  const [oldBusiness, setOldBusiness] = useState([]);
  const [deleteMeetingItemOpen, setDeleteMeetingItemOpen] = useState(false);
  const { t } = useTranslation();

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
      );
      if (response?.status === 204) {
        await refetchMeetingItems();
        setDeleteMeetingItemOpen(false);
      }
    }
  }, [selectedMeetingItem, refetchMeetingItems]);

  const handleEdit = item => {
    setIsEdit(true);
    setSideSheetOpen(true);
    setMeetingItem(item);
  };

  const handleDelete = item => {
    setDeleteMeetingItemOpen(true);
    setMeetingItem(item);
  };

  const actionList = useMemo(() => {
    let disabled = false;
    if (series && meeting) {
      const meetings = series?.cpsMeeting_groupCpsMeeting;
      const nextMeeting =
        meetings[meetings?.findIndex(m => m.id === meeting.id) + 1];

      disabled = !!nextMeeting;
    }

    return [
      {
        id: 1,
        title: t('Edit'),
        icon: EditIcon,
        onClick: handleEdit,
        disabled: disabled,
      },
      {
        id: 2,
        title: t('Delete'),
        icon: DeleteIcon,
        onClick: handleDelete,
        disabled: disabled,
      },
    ];
  }, [series, meeting]);

  const gridOptionsOldBusiness = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    onFirstDataRendered: function (params) {
      params.api.expandAll();
    },
    autoGroupColumnDef: {
      headerName: t('Category'),
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
        width: 5, // can't shrink beyond ag-grid enforced min-width
      },
      {
        headerName: t('Description'),
        field: 'subject',
        width: 200,
        autoHeight: true,
        wrapText: true,
        cellRenderer: 'meetingItemsRenderer',
      },
      {
        headerName: t('Owner'),
        field: 'owner',
        width: 50,
      },
      {
        headerName: t('Priority'),
        field: 'priority',
        width: 50,
      },
      {
        headerName: t('Due'),
        field: 'due_date',
        width: 50,
      },
      // {
      //   headerName: 'Status',
      //   field: 'status',
      //   width: 60,
      // },
      {
        headerName: t('Actions'),
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actionList,
        },
        width: 60,
        suppressMenu: true,
      },
    ],
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
      headerName: t('Category'),
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
        width: 5, // can't shrink beyond ag-grid enforced min-width
      },
      {
        headerName: t('Description'),
        field: 'subject',
        width: 200,
        autoHeight: true,
        wrapText: true,
        cellRenderer: 'meetingItemsRenderer',
      },
      {
        headerName: t('Owner'),
        field: 'owner',
        width: 50,
      },
      {
        headerName: t('Priority'),
        field: 'priority',
        width: 50,
      },
      {
        headerName: t('Due'),
        field: 'due_date',
        width: 50,
      },
      // {
      //   headerName: 'Status',
      //   field: 'status',
      //   width: 60,
      // },
      {
        headerName: t('Actions'),
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actionList,
        },
        width: 60,
        suppressMenu: true,
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ModalAlert
        open={deleteMeetingItemOpen}
        title={t("Delete Meeting Item")}
        message={t("Are you sure you want to delete this meeting item?")}
        action={deleteItem}
        closeAlert={() => setDeleteMeetingItemOpen(false)}
      />
      {fetchDataLoading? (
        <LinearProgress />
      ) : (
        <div>
          <AmbientGridTemplate
            title={t("Old Business")}
            gridOptions={gridOptionsOldBusiness}
            animateRows="true"
            domLayout="autoHeight"
            data={oldBusiness}
            useNewHeader
            height={'calc(100vh / 3 + 56)'}
            frameworkComponents={{
              actionsRenderer: ActionsRenderer,
              meetingItemsRenderer: MeetingItemsRenderer,
            }}
          />
          <AmbientGridTemplate
            title={t("New Business")}
            height={'calc(100vh / 3)'}
            gridOptions={gridOptionsNewBusiness}
            data={newBusiness}
            useNewHeader
            domLayout="autoHeight"
            frameworkComponents={{
              actionsRenderer: ActionsRenderer,
              meetingItemsRenderer: MeetingItemsRenderer,
            }}
          />
        </div>
      )}

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
        onClose={() => {
          setMinutesOpen(false);
        }}
      />
    </Box>
  );
};

export default MinutesTab;
