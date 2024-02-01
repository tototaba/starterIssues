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
import MeetingItemsRenderer from "../meeting/MeetingItems/MeetingItemsRenderer";

const MyMeetingItemsGrid = (props) => {
    const user = useUser();
    const [{ data: meetingItems }, refetchMeetingItems] = useAxiosGet(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsMeeting_item/${user.id}/${user.currentTenantId}/tenantUserMeetingItems`,
        {},
    );
    const actionList = useMemo(
        () => [
            {
                id: 1, // Must be unique
                title: 'Edit Meeting Item',
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
                headerName: 'Meeting Series',
                field: 'meetingSeriesName',
                width: 100,

            },
            {
                headerName: 'Status',
                field: 'status',
                width: 60,

            },
            // {
            //     headerName: 'Actions',
            //     cellRenderer: 'actionsRenderer',
            //     cellRendererParams: {
            //         actionList,
            //     },
            //     width: 30,
            //     suppressMenu: true,

            // },
        ]
    };

    const history = useHistory();
    const { gridApi, onGridReady } = useAgGridApi();
    const [meetings1, setMeetings] = useState([]);

    const handleRowSelected = useCallback(
        event => {
          let selectedMeeting = event.data;
          if (selectedMeeting) {
            history.push({
              pathname: `/meetings/${selectedMeeting.group_id}/meeting/${selectedMeeting.meeting_created_id}`,
              state: { meeting: meetings1 }
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

    return (
        <>
            <AmbientGridTemplate
                title='My Meeting Items'
                primaryActionButton={addMeetingButton}
                gridOptions={gridOptions}
                onRowSelected={handleRowSelected}
                onRowClicked={handleRowSelected}
                // rowSelection="single"
                data={meetingItems}
                // loading={loading}
                useNewHeader
                hideGroupTab
                hideColumnTab
                height="calc(100vh - 200px)"
                frameworkComponents={{ actionsRenderer: ActionsRenderer, meetingItemsRenderer: MeetingItemsRenderer }}
            />
        </>

    );
};

export default MyMeetingItemsGrid;
