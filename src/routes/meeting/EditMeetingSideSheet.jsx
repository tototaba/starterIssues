import React, { useState, useCallback, useEffect } from 'react';
import { Box, TextField } from '@material-ui/core';
import {
  Field,
  SideSheet,
  Form,
  FluentDatePicker,
  FluentTimePicker,
  SubmitButton,
  apiMutate,
  getSuccessAction,
  useHandleAxiosSnackbar,
  useOutlook,
  FluentButton,
  AmbientAlert
} from 'unity-fluent-library';
import { Switch, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  smallerTextField: {
    width: '225px', // Adjust the width as needed
  },
});

const EditMeetingSideSheet = (props) => {
  const {
    initialMeeting,
    fetchMeeting,
    open,
    onClose,
  } = props;
  const [meeting, setMeeting] = useState(initialMeeting);
  const [outlookAccessToken, setOutlookAccessToken] = useState(null);
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const { getAccessToken, invalidateUserSession, login, isUserSignedIn } = useOutlook(process.env.REACT_APP_MINUTES_URL + "/callback");
  const [updateInOutlook, setUpdateInOutlook] = useState(isUserSignedIn() && meeting?.outlookEventId);
  const classes = useStyles();

  useEffect(() => {
    setMeeting(initialMeeting);
  }, [initialMeeting]);

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

  function parseTime(timeString) {
    //12hr to 24hr
   const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    // Convert hour to 24-hour format
    let hour24;
    if (period === 'AM') {
        hour24 = hour === '12' ? '00' : hour.padStart(2, '0');
    } else {
        hour24 = hour === '12' ? '12' : String(Number(hour) + 12);
    }
    // Return the time in 24-hour format
    return hour24 + ':' + minute;
  }

  const updateMeeting = useCallback(
    async (meetingId, data) =>
      await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/${meetingId}`,
        {
          method: 'PUT',
          headers: {
            'outlookAccessToken': outlookAccessToken,
          }
        },
        data
      ),
    [outlookAccessToken]
  );

  const updateMeetingWithOutlook = useCallback(
    async (meetingId, data) =>
      await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/${meetingId}/${meeting.outlookEventId}`,
        {
          method: 'PUT',
          headers: {
            'outlookAccessToken': outlookAccessToken,
          }
        },
        data
      ),
    [meeting, outlookAccessToken]
  );

  const syncMeeting = useCallback(
    async (meetingId) =>
      await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/syncWithOutlook/${meetingId}`,
        {
          method: 'POST',
          headers: {
            'outlookAccessToken': outlookAccessToken,
          }
        },
      ),
    [outlookAccessToken]
  );

  const handleSwitchChange = useCallback(async (event) => {
    setUpdateInOutlook(event.target.checked);
  }, [setUpdateInOutlook])

  // Submit Edited Meeting
  const handleOnSubmit = useCallback(async values => {
    try {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      
      //24hr to 12hr
      const startTimeString = values.start_time;
      const [startHours, StartMinutes] = startTimeString.split(":");
      const startToday = new Date();
      const fullStartTime = new Date(startToday.getFullYear(), startToday.getMonth(), startToday.getDate(), startHours, StartMinutes);
      const StartTimeStringFormated = fullStartTime.toLocaleTimeString(undefined, options);

      const endTimeString = values.end_time;
      const [endHours, endMinutes] = endTimeString.split(":");
      const endToday = new Date();
      const fullendTime = new Date(endToday.getFullYear(), endToday.getMonth(), endToday.getDate(), endHours, endMinutes);
      const endTimeStringFormated = fullendTime.toLocaleTimeString(undefined, options);
  
      const updatedMeeting = {
        Date: values.date,
        Group_id: meeting.group_id,
        Id: meeting.id,
        Location: values.location,
        Meeting_number: values.meeting_number,
        Next_meeting_id: meeting.next_meeting_id,
        Start_time: StartTimeStringFormated,
        End_time: endTimeStringFormated,
        Status: meeting.status,
        Title: values.title,
        Meeting_number: values.meeting_number,
        outlookEventId: meeting.outlookEventId
      };

      let updateMeetingResponse;

      if (updateInOutlook && meeting?.outlookEventId) {
        updateMeetingResponse = await updateMeetingWithOutlook(
          meeting.id,
          {
            data: updatedMeeting
          }
        ).catch(res => {
          handleErrorSnackbar("", "Unable to create meeting in Outlook");
        });
      } else {
        updateMeetingResponse = await updateMeeting(
          meeting.id,
          {
            data: updatedMeeting
          }


        ).catch(res => {
          handleErrorSnackbar("", "Unable to update meeting");
        });

      }

      if (updateMeetingResponse?.status === 204 && updateInOutlook && !meeting?.outlookEventId) {
        await syncMeeting(meeting.id);
      }
      fetchMeeting();
      handleSuccessSnackbar("Successfully Updated Meeting")
      onClose();
    } catch (error) {
      console.log(error);
    }
  }, [meeting, updateInOutlook, outlookAccessToken, updateMeeting, updateMeetingWithOutlook, syncMeeting, fetchMeeting, handleSuccessSnackbar, handleErrorSnackbar, onClose]);

  const formatDate = (datetimeStr) => {  
    if (!datetimeStr) {  
      return '';  
    }  
    const date = new Date(datetimeStr);  
    const year = date.getFullYear();  
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed  
    const day = date.getDate().toString().padStart(2, '0');  
    return `${year}-${month}-${day}`;  
  };  

  return (
    <SideSheet
      title='Update Meeting'
      onClose={onClose}
      open={open}
      width='600px'
    >
      <Form onSubmit={handleOnSubmit}>
        {(isUserSignedIn() && !meeting?.outlookEventId) && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <AmbientAlert
                alertSeverity='info'
                showAlert={true}
                alertMessage={"This meeting does not exist in Outlook"}
              >


              </AmbientAlert>
            </Box>
          </div>
        )}
        <Box sx={{ display: 'flex', direction: 'row', gap: '1rem' }}>
          <Field
            component={TextField}
            label='Title'
            id='Title'
            name='title'
            variant='outlined'
            size='small'
            initialValue={meeting ? meeting.title : ''}
            udprecordid={'udpRecord-EditMeetingSideSheet-Title'}
          />
          <Field
            component={TextField}
            label='Meeting Number'
            id='meeting_Number'
            name='meeting_number'
            variant='outlined'
            size='small'
            initialValue={meeting ? meeting.meeting_number : ''}
            udprecordid={'udpRecord-EditMeetingSideSheet-meeting_Number'}
          />
        </Box>
        <Field
          component={TextField}
          label='Location'
          id='Location'
          name='location'
          variant='outlined'
          size='small'
          initialValue={meeting ? meeting.location : ''}
          udprecordid={'udpRecord-EditMeetingSideSheet-Location'}
        />
        <Box display='flex' direction='row' sx={{ gap: '1rem' }}>
          <Field
            component={FluentDatePicker}
            label='Date'
            id='Date'
            name='date'
            variant='outlined'
            initialValue={meeting ? formatDate(meeting.date) : ''}
            udprecordid={'udpRecord-EditMeetingSideSheet-Date'}
          />
          <Field
            type='time'
            component={TextField}
            label='Start Time'
            id='Start Time'
            name='start_time'
            variant='outlined'
            initialValue={meeting ? parseTime(meeting.start_time) : ''}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.smallerTextField}
            udprecordid={'udpRecord-EditMeetingSideSheet-Start_Time'}
          />
          <Field
            type='time'
            component={TextField}
            label='End Time'
            id='End Time'
            name='end_time'
            variant='outlined'
            initialValue={meeting ? parseTime(meeting.end_time) : ''}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.smallerTextField}
            udprecordid={'udpRecord-EditMeetingSideSheet-End_Time'}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '1rem' }}>

          {(isUserSignedIn() && !meeting?.outlookEventId) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                onChange={handleSwitchChange}
              />
              <Box>
                <Typography>
                  Create Meeting in Outlook
                </Typography>
              </Box>
            </div>
          )}
          {(isUserSignedIn() && meeting?.outlookEventId) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                onChange={handleSwitchChange}
                value={updateInOutlook}
              />
              <Typography>
                Update Meeting in Outlook
              </Typography>
            </div>
          )}
          <FluentButton
            variant='contained'
            color='primary'
            type='submit'
            id={'udpRecord-EditMeetingSideSheet-Update'}
            udprecordid={'udpRecord-EditMeetingSideSheet-Update'}
          >
            Update
          </FluentButton>
        </Box>

      </Form>
    </SideSheet>
  );

};

export default EditMeetingSideSheet;