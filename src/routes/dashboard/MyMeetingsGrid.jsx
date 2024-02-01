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


const MyMeetingsGrid = (props) => {
    const user = useUser();
    const history = useHistory();
    const { gridApi, onGridReady } = useAgGridApi();
    const [meetings1, setMeetings] = useState([]);

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

    return (
        <>
            <AmbientGridTemplate
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
            />
        </>

    );
};

export default MyMeetingsGrid;
