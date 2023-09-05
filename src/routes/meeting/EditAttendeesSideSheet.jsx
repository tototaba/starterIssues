import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SideSheet,
  // FluentTextFieldAutoComplete,
  Form,
  Field,
  SubmitButton,
  FluentDatePicker,
  FluentTimePicker,
  TimeField,
  FluentTextField,
  FluentSelectMenu,
  FormButtons,
  FluentTextFieldAutoComplete,
  apiMutate,
  useHandleAxiosSnackbar,
  AmbientStepper,
  FluentButton,
} from "unity-fluent-library"
import {
  Box,
  Button,
  TextField,
  responsiveFontSizes
} from '@material-ui/core';
import AttendeesGrid from './AttendeesGrid';
import MeetingItemFormPropertyTable from '../../utils/MeeingItemFormPropertyTable';
const EditAttendeesSideSheet = ({ open, onClose, meetingAttendees, meetingId = 96, meetingAttendeeMeeting, fetchMeeting }) => {
  // selectedMeetingSeries = { id: 31, name: "Series 1", cpsMeeting_groupCpsMeeting: [0, 1, 0, { location: "Univerus Head Office" }] }
  const formRef = useRef(null);
  const [attendeesMetaData, setAttendeesMetaData] = useState();
  const { handleErrorSnackbar, handleSuccessSnackbar } =
    useHandleAxiosSnackbar();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getAddedAndRemoved = () => {
    const values = formRef.current.values.users;
    const initialMeetingAttendees = meetingAttendeeMeeting;
    const addedAttendees = [];
    const removedAttendees = [];
    const updatedAttendees = [];

    const initialMap = new Map();
    for (let i = 0; i < initialMeetingAttendees.length; i++) {
      const item = initialMeetingAttendees[i];
      const key = `${item.attendee_id}`;
      initialMap.set(key, item);
    }

    const currentMap = new Map();
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      const key = `${item.id}`;
      currentMap.set(key, item);
    }
    // Check for added attendees
    currentMap.forEach((currentAttendee, key) => {
      if (!initialMap.has(key)) {
        addedAttendees.push(currentAttendee);
      }
    });

    // Check for removed attendees
    initialMap.forEach((initialAttendee, key) => {
      if (!currentMap.has(key)) {
        removedAttendees.push(initialAttendee);
      }
    });

    return { addedAttendees, removedAttendees };

  }

  const deleteMeetingAttendeeMeetings = async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "CpsMeeting_attendee_meeting/deleteMultiple",
        {
          method: "DELETE"
        },
        { data: attendees }
      );
    } catch (error) {
      throw error;
    }
  }

  const addMeetingAttendeeMeetings = async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "CpsMeeting_attendee_meeting/CreateMultiple",
        {
          method: "POST"
        },
        { data: attendees }
      );
    } catch (error) {
      console.log(error)
    }
  }

  const updateMeetingAttendeeMeetings = async (attendees) => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "CpsMeeting_attendee_meeting/updateMultiple",
        {
          method: "PUT"
        },
        { data: attendees }
      );
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const { addedAttendees, removedAttendees } = getAddedAndRemoved();

      if (addedAttendees.length !== 0) {
        const addedAttendeeMeetingAttendee = addedAttendees.map((attendee) => {
          return { Attendee_id: attendee.id, Meeting_id: meetingId }
        });
        await addMeetingAttendeeMeetings(addedAttendeeMeetingAttendee);
      }

      if (removedAttendees.length !== 0) {
        const removedAttendeeMeetingAttendee = removedAttendees.map((attendee) => {
          return { Attendee_id: attendee.id, Meeting_id: meetingId }
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
          });
        });
      }
      if (updatedAttendees.length !== 0) {
        await updateMeetingAttendeeMeetings(updatedAttendees)
      }

      fetchMeeting();
      handleSuccessSnackbar("Attendees updated successfully")
      onClose();
    } catch (error) {
      console.log(error)
      handleErrorSnackbar(error, "Error updating attendees")
    }

  }

  useEffect(() => {
    const newAttendeesMetaData = {};
    if (meetingAttendeeMeeting) {
      meetingAttendeeMeeting.forEach(row => {
        newAttendeesMetaData[row.id] = {
          send_review: row.send_review,
          send_minutes: row.send_minutes
        };
      });
    }
    setAttendeesMetaData(newAttendeesMetaData);

  }, [setAttendeesMetaData, meetingAttendeeMeeting]);

  const handleClose = () => {
    onClose();
  };

  const test = useCallback(() => {
    console.log(attendeesMetaData)
    console.log("🚀 ~ file: EditAttendeesSideSheet.jsx:184 ~ test ~ meetingAttendees:", meetingAttendees)
    console.log("🚀 ~ file: EditAttendeesSideSheet.jsx:183 ~ test ~ meetingAttendeeMeeting:", meetingAttendeeMeeting)
  }, [attendeesMetaData, meetingAttendeeMeeting]);

  return (
    <SideSheet
      onSubmit={handleSubmit}
      buttonLabel={"Update"}
      title="Manage Attendees"
      onClose={handleClose}
      open={open}
      width={"600px"}
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
        <Button onClick={test}>test</Button>
      </Form>
    </SideSheet >
  );
};

export default EditAttendeesSideSheet;