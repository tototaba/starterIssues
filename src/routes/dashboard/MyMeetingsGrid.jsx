import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    AmbientGridTemplate,
    ActionsRenderer,
    PrimaryActionButton,
    useAgGridApi,
    useAxiosGet,
    useUser,
} from 'unity-fluent-library';
import {
    AssignIcon,
    ContactIcon,
    EditIcon,
    AddIcon,
} from '@fluentui/react-icons';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AmbientTemplateGrid } from 'unity-ambient-x-react';


const MyMeetingsGrid = (props) => {
    const user = useUser();
    const history = useHistory();
    const { gridApi, onGridReady } = useAgGridApi();
    const [meetings1, setMeetings] = useState([]);
    const userId = user.id;

    const [{ data: meetings }, refetchMeetings] = useAxiosGet(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/${user.id}/${user.currentTenantId}`,
        {},
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
            { headerName: "Start Time", field: "start_time", },
            { headerName: "End Time", field: "end_time", },

        ],
    };

    const handleRowSelected = useCallback(
        event => {
          let selectedMeeting = event.data;
          if (selectedMeeting) {
            history.push({
              pathname: `/meetings/${selectedMeeting.group_id}/meeting/${selectedMeeting.id}`,
              state: { meeting: meetings1 }
            })
          }
        },
        [gridApi, history]
      );


    const addMeetingButton = (
        <PrimaryActionButton onClick={() => setOpen(true)}>
            <Typography>Add Meeting</Typography>
            <AddIcon />
        </PrimaryActionButton>
    )

    const defaultSearchObject = [{
        searchField: 'user_id',
        searchOperator: '=',
        searchValue: userId
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
            pathname: `/meetings/${value.groupId}/meeting/${value.meetingId}`,
            state: { meeting: meetings }
          })
        }
      };

    return (
        <>
            <AmbientTemplateGrid
                queryId={process.env.REACT_APP_MY_MEETINGS_DASHBOARD_QUERY_ID}
                tenantId={user.currentTenantId}
                userId={user.id}
                gridId={'0b60eab9-9d55-4b7c-aa23-8484414e3bc5'}
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
                title='My Meetings'
                primaryActionButton={addMeetingButton}
                gridOptions={gridOptions}
                onRowSelected={handleRowSelected}
                onRowClicked={handleRowSelected}
                data={meetings}
                useNewHeader
                hideGroupTab
                height="calc(100vh - 200px)"
                hideColumnTab
                frameworkComponents={{ actionsRenderer: ActionsRenderer }}
            /> */}
        </>

    );
};

export default MyMeetingsGrid;
