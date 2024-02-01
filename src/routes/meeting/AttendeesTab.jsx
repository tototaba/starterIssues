import { EditIcon } from '@fluentui/react-icons';
import { Box } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ActionsRenderer, AmbientGridTemplate, FluentTextFieldAutoComplete, useAxiosGet, apiMutate, useHandleAxiosSnackbar } from 'unity-fluent-library';
import EditAttendeesSideSheet from './EditAttendeesSideSheet';

const AttendeesTab = ({
  meetingId,
  seriesId,
  setAttendeesOpen,
  attendeesOpen,
}) => {

  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();

  const [meetingAttendees, setMeetingAttendees] = useState([]);

  const handleEdit = () => {
    setOpen(true);
  }

  const [{ data: meetingAttendeeMeeting }, refetchMeetingAttendeeMeeting] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_attendee_meeting/${meetingId}/meetingId`,
    {},
  );

  const fetchMeetingAttendees = useCallback(async (newCategory) => {
    try {
      if (!seriesId) return;
      const searchData = {
        data: {
          pageNumber: 1,
          pageSize: 30,
          orderElements: [{
            sortColumn: "id",
            sortDirection: "ASC"
          }],
          filterElements: [
            {
              searchField: "group_id",
              searchValue: seriesId,
              searchOperator: "="
            }
          ]
        }

        ,
        method: "POST"
      };

      const meeting_agendaResponse = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsMeeting_attendee/search`,
        searchData
      );

      meeting_agendaResponse.data.pageList.forEach((attendee) => {
        attendee.name = `${attendee.first_name} ${attendee.last_name}`;
      });

      // set the id value to attendee id for consistency
      meeting_agendaResponse.data.pageList.forEach((attendee) => {
        attendee.attendee_id = attendee.id;
      });

      setMeetingAttendees(meeting_agendaResponse.data.pageList);

    } catch (error) {
      handleErrorSnackbar("", "Error fetching meeting attendees")
    }
  }, [meetingId, seriesId]);

  useEffect(() => {
    fetchMeetingAttendees();
  }, []);

  const actionList = useMemo(
    () => [
      {
        id: 1, // Must be unique
        title: 'Edit',
        icon: EditIcon,
        onClick: handleEdit,
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
      { headerName: 'Name', field: 'name', },
      // { headerName: 'Type', field: 'type', },
      // { headerName: 'Company', field: 'company', },
      {
        headerName: 'Send Review', field: 'send_review',
        valueGetter: (params) => {
          return params.data.send_review ? 'Yes' : 'No';
        }
      },
      {
        headerName: 'Send Minutes', field: 'send_minutes',
        valueGetter: (params) => {
          return params.data.send_minutes ? 'Yes' : 'No';
        }
      },
      // { headerName: 'Minutes Taker', field: 'minutes_taker', },
      {
        headerName: 'Attended', field: 'attended',
        valueGetter: (params) => {
          return params.data.attended ? 'Yes' : 'No';
        }
      },
      {
        headerName: 'Minutes Taker', field: 'prepared_by',
        valueGetter: (params) => {
          return params.data.prepared_by ? 'Yes' : 'No';
        }
      },
    ],
  };

  return (
    <>
      <AmbientGridTemplate
        title='Attendees'
        gridOptions={gridOptions}
        data={meetingAttendeeMeeting}
        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
      />
      <EditAttendeesSideSheet
        meetingId={meetingId}
        meetingAttendees={meetingAttendees}
        meetingAttendeeMeeting={meetingAttendeeMeeting}
        open={attendeesOpen}
        onClose={() => { setAttendeesOpen(false) }}
        refetchMeetingAttendeeMeetings={refetchMeetingAttendeeMeeting}
        refetchMeetingAttendees={fetchMeetingAttendees}
        meetingSeriesId={seriesId}
      />
    </>
  );
};

export default AttendeesTab;

