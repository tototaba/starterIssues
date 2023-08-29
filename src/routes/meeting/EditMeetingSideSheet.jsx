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
} from 'unity-fluent-library';
import { useSnackbar } from 'notistack';

const EditMeetingSideSheet = (props) => {
  const {
    initialMeeting,
    fetchMeeting,
    open,
    onClose,
  } = props;
  const [ meeting, setMeeting ] = useState(initialMeeting);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const successAction = getSuccessAction(closeSnackbar);

  useEffect(() => {
    setMeeting(initialMeeting);
  }, [initialMeeting]);

  const updateMeeting = useCallback(
    async (meetingId, data) =>
      await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting/${meetingId}`,
        {
          method: 'PUT',
        },
        data
      ),
    []
  );

  // Submit Edited Meeting
  const handleOnSubmit = async values => {
    const updatedMeeting = {
      Date: values.date,
      End_time: values.end_time,
      Group_id: meeting.group_id,
      Id: meeting.id,
      Location: values.location,
      Meeting_number: values.meeting_number,
      Next_meeting_id: meeting.next_meeting_id,
      Start_time: values.start_time,
      Status: meeting.status,
      Title: values.title
    };

    const updateMeetingResponse = await updateMeeting(
      meeting.id,
      {
        data: updatedMeeting
      }
    ).catch(res => {
      enqueueSnackbar(res.response.data, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    });
    if (updateMeetingResponse?.status === 204) {
      fetchMeeting();
      enqueueSnackbar('Meeting has been updated', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        action: successAction,
      });
    }
    onClose();
  };

  return(
    <SideSheet 
      title='Update Meeting' 
      onClose={onClose} 
      open={open}
      width='600px'
      >
      <Form onSubmit={handleOnSubmit}>
        <Box sx={{ display: 'flex', direction: 'row', gap: '1rem'}}>
          <Field
            component={TextField}
            label='Title'
            id='Title'
            name='title'
            variant='outlined'
            size='small'
            initialValue={meeting ? meeting.title : ''}
          />
          <Field
            component={TextField}
            label='Meeting Number'
            id='Meeting Number'
            name='meeting number'
            variant='outlined'
            size='small'
            initialValue={meeting ? meeting.meeting_number : ''}
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
        />
        <Box display='flex' direction='row' sx={{ gap: '1rem'}}>
          <Field
            component={FluentDatePicker}
            label='Date'
            id='Date'
            name='date'
            variant='outlined'
            initialValue={meeting ? meeting.date : ''}
          />
          <Field
            component={FluentTimePicker}
            label='Start Time'
            id='Start Time'
            name='start_time'
            variant='outlined'
            initialValue={meeting ? meeting.start_time : ''}
          />
          <Field
            component={FluentTimePicker}
            label='End Time'
            id='End Time'
            name='end_time'
            variant='outlined'
            initialValue={meeting ? meeting.end_time : ''}
          />
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'flex-end', margin: '1rem'}}>
          <SubmitButton
            variant='contained'
            color='primary'
          >
            Update
          </SubmitButton>
        </Box>
      </Form>
    </SideSheet>
  );

};

export default EditMeetingSideSheet;