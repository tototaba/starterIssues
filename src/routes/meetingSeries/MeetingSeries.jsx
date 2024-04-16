import { useSnackbar } from 'notistack';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AmbientGridTemplate,
  useUser,
  ActionsRenderer,
  PrimaryActionButton,
  useAgGridApi,
  useAxiosGet,
  useOutlook,
  PrimaryActionHeader,
} from 'unity-fluent-library';
import {
  AssignIcon,
  ContactIcon,
  EditIcon,
  AddIcon,
} from '@fluentui/react-icons';
import { Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CreateMeetingSideSheet from '../meeting/CreateMeetingSideSheet';
import { AmbientTemplateGrid } from 'unity-ambient-x-react';

const MeetingSeries = props => {
  const { params, ...other } = props;
  const [loading, setLoading] = useState(false);
  const { gridApi, onGridReady } = useAgGridApi();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const user = useUser();

  const getAccessToken = useOutlook(
    process.env.REACT_APP_MINUTES_URL + '/callback'
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getAccessToken();
        console.log(token);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const [{ data: meetingSeries }, refetchMeetingSeries] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_group/tenant/${user?.currentTenantId}/DTO`,
    {},
    !!!user.currentTenantId
  );

  const [{ data: tenantUsers }, refetchTenantUsers] = useAxiosGet(
    process.env.REACT_APP_SECURITY_API_BASE,
    `users?tenantId=${user?.currentTenantId}&includeOnlyActiveTenants=true`,
    {},
    !!!user?.id
  );

  const handleOnClose = () => {
    refetchMeetingSeries();
    setOpen(false);
  };

  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit Meeting Series',
        icon: EditIcon,
        // onClick: handleEdit,
        disabled: false,
      },
      {
        id: 2, // Must be unique
        title: 'Update Item Form',
        icon: AssignIcon,
        // onClick: handleUpdate,
        disabled: false,
      },

      {
        id: 3, // Must be unique
        title: 'Manage Meeting Observers',
        icon: ContactIcon,
        // onClick: handleManage,
        disabled: false,
      },
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
      // { headerName: 'Meeting Series id', field: 'id', },
      { headerName: 'Title', field: 'name' },
      { headerName: 'Meetings in Series', field: 'meeting_count' },
      { headerName: 'Open Items', field: 'item_count' },
      // { headerName: 'Draft Sent', field: 'draft_sent', },
      // { headerName: 'Final Sent', field: 'final_sent', },
      // {
      //   headerName: 'Actions',
      //   cellRenderer: 'actionsRenderer',
      //   cellRendererParams: {
      //     actionList
      //   },
      //   suppressMenu: true,
      // }
    ],
  };

  const handleRowSelected = useCallback(
    event => {
      let selectedMeetingSeries = event.data;
      if (selectedMeetingSeries) {
        history.push(`/meetings/${selectedMeetingSeries.id}`);
      }
    },
    [gridApi, history]
  );

  const addMeetingSeriesButton = (
    <PrimaryActionButton 
      onClick={() => setOpen(true)} 
      id='udpRecord-MeetingSeries-NewMeetingSeries' 
      udprecordid='udpRecord-MeetingSeries-NewMeetingSeries'
    >
      <Typography>New Meeting Series</Typography>
      <AddIcon />
    </PrimaryActionButton>
  );

  const renderConfigs = [
    {
      field: 'actions',
      rendererName: 'hotListAddRenderer',
      otherField: 'id',
      callbackId: 'handleRowSelected',
    },
  ];

  const handleCellClick = (value, callback) => {
    if (callback === 'handleRowSelected') {
      history.push(`/meetings/${value.id}`);
    }
  };

  return (
    <>
      <PrimaryActionHeader
        title="Meeting Series"
        single
        buttonLabel={'New Meeting Series'}
        id='udpRecord-MeetingSeries-NewMeetingSeries'
        udprecordid='udpRecord-MeetingSeries-NewMeetingSeries'
        handleClick={() => setOpen(true)}
      />

      <AmbientTemplateGrid
        queryId={process.env.REACT_APP_MEETING_SERIES_QUERY_ID}
        tenantId={user.currentTenantId}
        userId={user.id}
        gridId={'2607cfa1-2306-43cd-93c0-3202935567e0'}
        productId={53}
        accessToken={user.accessToken}
        user={user}
        callbackId="2"
        cellClickHandler={handleCellClick.bind(this)}
        cellClickHandlerX={handleCellClick.bind(this)}
        renderConfigs={renderConfigs}
        fitGrid='fit'
      ></AmbientTemplateGrid>

      {/* <AmbientGridTemplate
        title='Meeting Series'
        primaryActionButton={addMeetingSeriesButton}
        gridOptions={gridOptions}
        onRowSelected={handleRowSelected}
        onRowClicked={handleRowSelected}
        rowSelection="single"
        data={meetingSeries}
        loading={loading}
        api={gridApi}
        height="calc(100vh - 112px)"
        hideGroupTab
        hideColumnTab
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      /> */}

      <CreateMeetingSideSheet
        open={open}
        onClose={handleOnClose}
        tenantUsers={tenantUsers}
      />
    </>
  );
};

export default MeetingSeries;
