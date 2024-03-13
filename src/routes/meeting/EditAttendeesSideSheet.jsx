import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SideSheet,
  // FluentTextFieldAutoComplete,
  Form,
  Field,
  FluentTextFieldAutoComplete,
  apiMutate,
  useHandleAxiosSnackbar,
  useAxiosGet,
  useUser,
  useOutlook
} from "unity-fluent-library"
import AttendeesGrid from './AttendeesGrid';
const EditAttendeesSideSheet = ({
  open,
  onClose,
  meetingAttendees,
  meetingId,
  meetingAttendeeMeeting,
  refetchMeetingAttendees,
  refetchMeetingAttendeeMeetings,
  meetingSeriesId,
  refetchMeeting
}) => {
  const formRef = useRef(null);
  const [attendeesMetaData, setAttendeesMetaData] = useState();
  const [outlookAccessToken, setOutlookAccessToken] = useState();
  const { handleErrorSnackbar, handleSuccessSnackbar } =
    useHandleAxiosSnackbar();
  const user = useUser();
  const { getAccessToken, invalidateUserSession, login, isUserSignedIn } = useOutlook(process.env.REACT_APP_MINUTES_URL + "/callback");
  const [{ data: tenantUsers }, refetchTenantUsers] = useAxiosGet(
    process.env.REACT_APP_SECURITY_API_BASE,
    `users?tenantId=${user?.currentTenantId}&includeOnlyActiveTenants=true`,
    {},
    !!!user?.id
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getAccessToken();
        setOutlookAccessToken(token);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [setOutlookAccessToken]);

  useEffect(() => {

    if (!meetingAttendees || !tenantUsers) {
      return;
    }
    for (let user of tenantUsers) {
      if (!(meetingAttendees.some(attendee => attendee.user_id === user.unityId))) {
        meetingAttendees.push({
          user_id: user.unityId,
          first_name: user.givenName,
          last_name: user.surname,
          group_id: meetingSeriesId,
          email: user.email,
          name: `${user.givenName} ${user.surname}`,
        });
      }
    }
  }, [meetingAttendees, tenantUsers, meetingSeriesId]);

  const getAddedAndRemoved = (formValues, initialMeetingAttendees) => {
    const values = formValues.users;
    const addedAttendees = [];
    const removedAttendees = [];
    const addedAttendeesWithNoId = [];
    const initialMap = new Map();
    initialMeetingAttendees.forEach((item) => {
      const key = `${item.attendee_id}`;
      initialMap.set(key, item);
    });

    const currentMap = new Map();
    values.forEach((item) => {
      const key = `${item.attendee_id}`;
      currentMap.set(key, item);
    });

    // Check for added attendees
    currentMap.forEach((currentAttendee, key) => {
      if (!initialMap.has(key) && currentAttendee.attendee_id) {
        addedAttendees.push(currentAttendee);
      } else if (!initialMap.has(key) && !currentAttendee.attendee_id) {
        addedAttendeesWithNoId.push(currentAttendee);
      }
    });

    // Check for removed attendees
    initialMap.forEach((initialAttendee, key) => {
      if (!currentMap.has(key)) {
        removedAttendees.push(initialAttendee);
      }
    });


    return { addedAttendees, removedAttendees, addedAttendeesWithNoId };
  };


  const deleteMeetingAttendeeMeetings = useCallback(async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        "CpsMeeting_attendee_meeting/deleteMultiple",
        {
          method: "DELETE",
          headers: {
            "outlookAccessToken": outlookAccessToken
          }
        },
        { data: attendees },

      );
    } catch (error) {
      throw error;
    }
  }, [outlookAccessToken])

  const addMeetingAttendees = useCallback(async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        "CpsMeeting_attendee/createAttendees",
        {
          method: "POST",
          headers: {
            "outlookAccessToken": outlookAccessToken
          }
        },
        { data: attendees }
      );
      return response;
    } catch (error) {
      handleErrorSnackbar("", "Error Creating attendees")
    }
  }, [outlookAccessToken])

  const addMeetingAttendeeMeetings = useCallback(async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        "CpsMeeting_attendee_meeting/CreateMultiple",
        {
          method: "POST",
          headers: {
            "outlookAccessToken": outlookAccessToken
          }
        },
        { data: attendees }
      );
    } catch (error) {
      handleErrorSnackbar("", "Error adding attendees")
    }
  }, [outlookAccessToken])

  const updateMeetingAttendeeMeetings = useCallback(async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        "CpsMeeting_attendee_meeting/updateMultiple",
        {
          method: "PUT",
          headers: {
            "outlookAccessToken": outlookAccessToken
          }
        },
        { data: attendees }
      );
    } catch (error) {
      handleErrorSnackbar("", "Error updating attendees")
    }
  }, [outlookAccessToken])

  const handleSubmit = async (values) => {
    try {
      const { addedAttendees, removedAttendees, addedAttendeesWithNoId } = getAddedAndRemoved(formRef.current.values, meetingAttendeeMeeting);

      // First if statement: Handle attendees with no ID and add them to the addedAttendees array
      if (addedAttendeesWithNoId.length !== 0) {
        const createdMeetingAttendees = await addMeetingAttendees(addedAttendeesWithNoId);
        createdMeetingAttendees.data.forEach(meetingAttendee => {
          addedAttendees.push({ id: meetingAttendee.id });
        });
      }

      // Preparing the association array for all attendees
      const addedAttendeeMeetingAttendee = addedAttendees.map((attendee) => {
        return { Attendee_id: attendee.id, Meeting_id: meetingId };
      });

      // Call addMeetingAttendeeMeetings if there are any attendees to be associated with the meeting
      if (addedAttendees.length !== 0) {
        await addMeetingAttendeeMeetings(addedAttendeeMeetingAttendee);
      }


      if (removedAttendees.length !== 0) {
        const removedAttendeeMeetingAttendee = removedAttendees.map((attendee) => {
          return { Attendee_id: attendee.attendee_id, Meeting_id: meetingId }
        });
        await deleteMeetingAttendeeMeetings(removedAttendeeMeetingAttendee);
      }

      const updatedAttendees = [];
      if (attendeesMetaData) {
        Object.keys(attendeesMetaData).forEach((key) => {
          updatedAttendees.push({
            attendee_id: key,
            meeting_id: meetingId,
            send_review: attendeesMetaData[key].send_review ? 1 : 0,
            send_minutes: attendeesMetaData[key].send_minutes ? 1 : 0,
            attended: attendeesMetaData[key].attended ? 1 : 0,
            prepared_by: attendeesMetaData[key].prepared_by ? 1 : 0
          });
        });

      }
      if (updatedAttendees.length !== 0) {
        await updateMeetingAttendeeMeetings(updatedAttendees)
      }

      refetchMeetingAttendees();
      refetchMeetingAttendeeMeetings();
      refetchMeeting();
      handleSuccessSnackbar("Attendees updated successfully")
      onClose();
    } catch (error) {
      handleErrorSnackbar(error, "Error updating attendees")
    }

  }

  useEffect(() => {
    const newAttendeesMetaData = {};
    if (meetingAttendeeMeeting) {
      meetingAttendeeMeeting.forEach(row => {
        newAttendeesMetaData[row.attendee_id] = {
          ...row,
        };
      });
    }
    setAttendeesMetaData(newAttendeesMetaData);

  }, [setAttendeesMetaData, meetingAttendeeMeeting]);

  const handleClose = () => {
    onClose();
  };

  return (
    <SideSheet
      onSubmit={handleSubmit}
      buttonLabel={"Update"}
      title="Manage Attendees"
      onClose={handleClose}
      open={open}
      width={"800px"}
      id={"udpRecord-EditAttendeesSideSheet-submit"}
      udpRecordId={"udpRecord-EditAttendeesSideSheet-submit"}
    >
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Field
          label={"Attendees"}
          component={FluentTextFieldAutoComplete}
          id="users"
          name="users"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          isMultiple
          options={meetingAttendees}
          optionKey={'name'}
          initialValue={meetingAttendeeMeeting}
        />
        <AttendeesGrid
          rows={meetingAttendeeMeeting}
          setAttendeesMetaData={setAttendeesMetaData}
          attendeesMetaData={attendeesMetaData}
        />
      </Form>
    </SideSheet >
  );
};

export default EditAttendeesSideSheet;