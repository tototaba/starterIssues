import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, Box, Typography } from '@mui/material';
import { Edit, Delete, SkipNext, ArrowForwardIosOutlined } from '@mui/icons-material';
import {
  FluentButton,
  apiMutate,
  getSuccessAction,
  useHandleAxiosSnackbar,
} from 'unity-fluent-library';
import { Tooltip } from '@material-ui/core';
import EditMeetingSideSheet from './EditMeetingSideSheet';
import ModalAlert from '../../UI/ModalAlert';
import { useHistory } from 'react-router-dom';

const MeetingControls = (props) => {
  const {
    meeting,
    fetchMeeting,
    newBusiness,
  } = props;
  const [openEditMeetingSideSheet, setOpenEditMeetingSideSheet] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [meetingGroup, setMeetingGroup] = useState('');
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const history = useHistory();

  useEffect(() => {
    if (meeting) {
      setMeetingGroup(meeting.cpsMeetingCpsMeeting_group);
    }
  }, [meeting]);

  const deleteMeeting = useCallback(
    async () =>
      await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting/${meeting?.id}`,
        {
          method: 'delete',
        }
      ),
    [meeting]
  );

  const rerouteToMeetings = () => {
    history.push(`/meetings/${meetingGroup.id}`)
  };

  const handleDelete = useCallback(async () => {
    if (!newBusiness.length) {
      console.log(newBusiness);
      const response = await deleteMeeting().catch(res => {
        console.log(res);

      });
      console.log(response);
      if (response?.status === 204) {
        handleSuccessSnackbar("", "Meeting deleted successfully");
        rerouteToMeetings();
      }
      setOpenDeleteModal(false);
    }
  });

  const handleNextMeeting = () => {
    // Handle navigation to previous meeting
  };

  const handleNextSeries = () => {
    // Handle navigation to next meeting
  };

  return (
    <Box spacing={2}>
      <EditMeetingSideSheet
        initialMeeting={meeting}
        fetchMeeting={fetchMeeting}
        open={openEditMeetingSideSheet}
        onClose={() => setOpenEditMeetingSideSheet(false)}
      />
      <ModalAlert
        title={`Delete ${meeting ? meeting.title : ''}`}
        message='Are you sure you want to delete this meeting?'
        closeAlert={() => setOpenDeleteModal(false)}
        open={openDeleteModal}
        action={handleDelete}
      />
      <IconButton onClick={setOpenEditMeetingSideSheet} >
        <Edit />
        <Typography>Edit</Typography>
      </IconButton>
      <Tooltip title="The latest meeting can only be deleted if it does not have any New Business items">
        <IconButton onClick={() => setOpenDeleteModal(true)} >
          <Delete />
          <Typography>Delete</Typography>
        </IconButton>
      </Tooltip>
      <IconButton disabled={true} onClick={handleNextMeeting} >
        <SkipNext />
        <Typography>Next Meeting</Typography>
      </IconButton>
      <IconButton disabled={true} onClick={handleNextSeries} >
        <ArrowForwardIosOutlined />
        <Typography>Next Series</Typography>
      </IconButton>
      <FluentButton style={{ fontSize: '26px' }} variant='outlined' color='secondary'>
        New Meeting
      </FluentButton>
    </Box>
  );
};

export default MeetingControls;
