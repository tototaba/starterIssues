import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AmbientGridTemplate,
  ActionsRenderer,
  PrimaryActionButton,
  useAgGridApi,
  useAxiosGet,
  useUser,
  PrimaryActionHeader,
} from 'unity-fluent-library';
import {
  AssignIcon,
  ContactIcon,
  EditIcon,
  AddIcon,
} from '@fluentui/react-icons';
import { Typography } from '@material-ui/core';
import { formatDate, formatDateString } from '../../utils/formatDateHelpers';
import { useHistory } from 'react-router-dom';
import CreateMeetingSideSheet from '../meeting/CreateMeetingSideSheet';
import { AmbientTemplateGrid } from 'unity-ambient-x-react';

const Meetings = (props) => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingSeriesId, setMeetingSeriesId] = useState(params?.meetingSeriesId || null);
  const { gridApi, onGridReady } = useAgGridApi();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const user = useUser();

  const [{ data: meetingSeries }, refetchMeetingSeries] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_group/${meetingSeriesId}/full`,
    {},
  );

  useEffect(() => {
    refetchMeetingSeries();
  }, []);

  const [{ data: tenantUsers }, refetchTenantUsers] = useAxiosGet(
    process.env.REACT_APP_SECURITY_API_BASE,
    `users?tenantId=${user?.currentTenantId}&includeOnlyActiveTenants=true`,
    {},
    !!!user?.id
  );

  useEffect(() => {
    if (meetingSeries) {
      setMeetings(meetingSeries.cpsMeeting_groupCpsMeeting);
    }
  }, [meetingSeries]);

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
      { headerName: 'Title', field: 'title', },
      { headerName: 'Meeting #', field: 'meeting_number', },
      {
        headerName: 'Date',
        field: 'date',
        // valueGetter: formatDateString
      },
      { headerName: 'Location', field: 'location', },
      { headerName: "Start Time", field: "start_time", },
      { headerName: "End Time", field: "end_time", },
      {
        headerName: "Outlook Synced", field: "outlookEventId",

        valueGetter: (params) => {
          return params.data.outlookEventId ? "Yes" : "No"
        }
      },
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
      let selectedMeeting = event.data;
      if (selectedMeeting) {
        history.push({
          pathname: `/meetings/${meetingSeriesId}/meeting/${selectedMeeting.id}`,
          state: { meeting: meetings }
        })
      }
    },
    [gridApi, history]
  );

  const handleOnClose = () => {
    refetchMeetingSeries();
    setOpen(false);
  };

  const addMeetingButton = (
    <PrimaryActionButton onClick={() => setOpen(true)}>
      <Typography>Add Meeting</Typography>
      <AddIcon />
    </PrimaryActionButton>
  )

  const defaultSearchObject = [{
    searchField: 'group_id',
    searchOperator: '=',
    searchValue: meetingSeriesId
  }]

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
      history.push({
        pathname: `/meetings/${meetingSeriesId}/meeting/${value.id}`,
        state: { meeting: meetings }
      })
    }
  };

  return (
    <>
      <CreateMeetingSideSheet
        open={open}
        onClose={handleOnClose}
        tenantUsers={tenantUsers}
        meetingSeries={meetingSeries}
      />

<PrimaryActionHeader
        title="Meetings"
        single
        buttonLabel={'Add Meeting'}
        id="udpRecord-Meetings-NewMeetingSeries"
        udprecordid="udpRecord-Meetings-NewMeetingSeries"
        handleClick={() => setOpen(true)}
      />

    <AmbientTemplateGrid
        queryId={process.env.REACT_APP_MEETINGS_QUERY_ID}
        tenantId={user.currentTenantId}
        userId={user.id}
        gridId={'009246e6-158b-48da-aa00-93f6b58ebaa2'}
        productId={53}
        accessToken={user.accessToken}
        user={user}
        callbackId="2"
        cellClickHandler={handleCellClick.bind(this)}
        cellClickHandlerX={handleCellClick.bind(this)}
        renderConfigs={renderConfigs}
        defaultSearchObject={defaultSearchObject}
        viewActionClickHandler={handleCellClick.bind(this)}
        fitGrid='fit'
        showHotlistButton={false}
      ></AmbientTemplateGrid>

      {/* <AmbientGridTemplate
        title='Meetings'
        primaryActionButton={addMeetingButton}
        gridOptions={gridOptions}
        onRowSelected={handleRowSelected}
        onRowClicked={handleRowSelected}
        rowSelection="single"
        height="calc(100vh - 112px)"
        data={meetings}
        loading={loading}
        hideGroupTab
        hideColumnTab
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      /> */}
    </>

  );
};

export default Meetings;
