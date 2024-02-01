import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, Box, Typography } from '@mui/material';
import { Edit, Delete, SkipNext, ArrowForwardIosOutlined, ArrowBackIosNewOutlined, ArrowBackIos, FlipToBack, ArrowBackIosOutlined, SkipPrevious } from '@mui/icons-material';
import {
  FluentButton,
  apiMutate,
  getSuccessAction,
  useHandleAxiosSnackbar,
  IconButtonWithTooltip,
  useOutlook,
} from 'unity-fluent-library';
import { Tooltip } from '@material-ui/core';
import EditMeetingSideSheet from './EditMeetingSideSheet';
import ModalAlert from '../../UI/ModalAlert';
import { useHistory } from 'react-router-dom';

const MeetingControls = (props) => {
  const {
    meeting,
    fetchMeeting,
    meetingSeries,
    refetchSeries,
    hasMeetingItems,
  } = props;
  const [openEditMeetingSideSheet, setOpenEditMeetingSideSheet] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [meetingGroup, setMeetingGroup] = useState('');
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const history = useHistory();
  const [outlookAccessToken, setOutlookAccessToken] = useState(null);
  const { getAccessToken, invalidateUserSession, login, isUserSignedIn } = useOutlook(process.env.REACT_APP_MINUTES_URL + "/callback");

  useEffect(() => {
    if (meeting) {
      setMeetingGroup(meeting.cpsMeetingCpsMeeting_group);
    }
  }, [meeting]);

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

  const deleteMeeting = useCallback(
    async () => {

      return await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/${meeting?.id}/${meeting?.outlookEventId}`,
        {
          method: 'delete',
          headers: {
            'outlookAccessToken': outlookAccessToken,
          }
        }
      )
    },
    [meeting, outlookAccessToken]
  );

  const handleDelete = useCallback(async () => {

    if (meeting?.outlookEventId && (!outlookAccessToken || !isUserSignedIn())) {
      login();
    }

    const response = await deleteMeeting().catch(res => {
      handleErrorSnackbar("", "Error deleting meeting");
    });
    if (response?.status === 204) {
      await refetchSeries();
      handleSuccessSnackbar("Meeting deleted successfully");
      setOpenDeleteModal(false);
      history.push(`/meetings/${meetingSeries.id}`);
    }
    else {
      handleErrorSnackbar("", "Cannot Delete Meeting With Meeting Items");
    }
  }, [meeting, meetingSeries]);

  const isLastMeeting = useCallback(() => {
    if (!meetingSeries) return false;
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    return meetings[meetings.length - 1]?.id === meeting.id;
  }, [meetingSeries, meeting]);

  const isFirstMeeting = () => {
    if (!meetingSeries) return false;
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    return meetings[0]?.id === meeting.id;
  }

  const rerenderWithNewMeeting = (newMeetingId) => {
    history.push(`/meetings/${meetingSeries.id}/meeting/${newMeetingId}`);
    fetchMeeting();
  }

  const handlePreviousMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const previousMeetingId = meetings[meetings.findIndex(m => m.id === meeting.id) - 1]?.id;
    rerenderWithNewMeeting(previousMeetingId);
  }, [meetingSeries, meeting]);

  const handleNextMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const nextMeetingId = meetings[meetings.findIndex(m => m.id === meeting.id) + 1]?.id;
    rerenderWithNewMeeting(nextMeetingId);
  }, [meetingSeries, meeting]);

  const handleLastMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const lastMeetingId = meetings[meetings.length - 1]?.id;
    rerenderWithNewMeeting(lastMeetingId);
  }, [meetingSeries, meeting]);

  const handleFirstMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const firstMeetingId = meetings[0]?.id;
    rerenderWithNewMeeting(firstMeetingId);
  }, [meetingSeries, meeting]);
  return (
    <>
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
        <IconButtonWithTooltip
          icon={SkipPrevious}
          title="First Meeting"
          disabled={isFirstMeeting()}
          onClick={handleFirstMeeting} // Assuming this should not be clickable when disabled
        />
        <IconButtonWithTooltip
          icon={ArrowBackIosNewOutlined}
          title="Previous Meeting"
          disabled={isFirstMeeting()}
          onClick={handlePreviousMeeting} // Replace with the correct function if needed
        />
        <IconButtonWithTooltip
          icon={ArrowForwardIosOutlined}
          title="Next Meeting"
          disabled={isLastMeeting()}
          onClick={handleNextMeeting}
        />
        <IconButtonWithTooltip
          icon={SkipNext}
          title="Last Meeting"
          disabled={isLastMeeting()}
          onClick={handleLastMeeting} // Assuming this should not be clickable when disabled
        />
        <IconButtonWithTooltip
          icon={Edit}
          title="Edit Meeting"
          onClick={setOpenEditMeetingSideSheet}
        />
        <IconButtonWithTooltip
          icon={Delete}
          title={hasMeetingItems ? "Cannot Delete Meeting With Meeting Items" : "Delete Meeting"}
          disabled={hasMeetingItems}
          onClick={() => setOpenDeleteModal(true)}
        />
      </Box >

    </>
  );
};

export default MeetingControls;
