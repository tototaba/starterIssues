import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, IconButton, Box, Typography } from '@mui/material';
import {
  Edit,
  Delete,
  SkipNext,
  ArrowForwardIosOutlined,
  ArrowBackIosNewOutlined,
  ArrowBackIos,
  FlipToBack,
  ArrowBackIosOutlined,
  SkipPrevious,
  Add,
} from '@mui/icons-material';

import {
  FluentButton,
  apiMutate,
  getSuccessAction,
  useHandleAxiosSnackbar,
  IconButtonWithTooltip,
  useOutlook,
  PrimaryActionButton,
} from 'unity-fluent-library';
import { Tooltip, useTheme } from '@material-ui/core';
import EditMeetingSideSheet from './EditMeetingSideSheet';
import ModalAlert from '../../UI/ModalAlert';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MeetingControls = props => {
  const {
    meeting,
    fetchMeeting,
    meetingSeries,
    refetchSeries,
    hasMeetingItems,
    primaryActionFunction,
    primaryActionButton,
  } = props;
  const [openEditMeetingSideSheet, setOpenEditMeetingSideSheet] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [meetingGroup, setMeetingGroup] = useState('');
  const { handleErrorSnackbar, handleSuccessSnackbar } =
    useHandleAxiosSnackbar();
  const history = useHistory();
  const [outlookAccessToken, setOutlookAccessToken] = useState(null);
  const { getAccessToken, invalidateUserSession, login, isUserSignedIn } =
    useOutlook(process.env.REACT_APP_MINUTES_URL + '/callback');
  const theme = useTheme();
  const { t } = useTranslation();

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
    };
    fetch();
  }, [setOutlookAccessToken]);

  const deleteMeeting = useCallback(async () => {
    return await apiMutate(
      process.env.REACT_APP_MEETING_MINUTES_API_BASE,
      `cpsmeeting/${meeting?.id}/${meeting?.outlookEventId}`,
      {
        method: 'delete',
        headers: {
          outlookAccessToken: outlookAccessToken,
        },
      }
    );
  }, [meeting, outlookAccessToken]);

  const handleDelete = useCallback(async () => {
    if (meeting?.outlookEventId && (!outlookAccessToken || !isUserSignedIn())) {
      login();
    }

    const response = await deleteMeeting().catch(res => {
      handleErrorSnackbar('', t('Error deleting meeting'));
    });
    if (response?.status === 204) {
      await refetchSeries();
      handleSuccessSnackbar(t('Meeting deleted successfully'));
      setOpenDeleteModal(false);
      history.push(`/meetings/${meetingSeries.id}`);
    } else {
      handleErrorSnackbar('', t('Cannot Delete Meeting With Meeting Items'));
    }
  }, [meeting, meetingSeries]);

  const isLastMeeting = useMemo(() => {
    if (!meetingSeries) return false;
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    return meetings[meetings.length - 1]?.id === meeting.id;
  }, [meetingSeries, meeting]);

  const isFirstMeeting = () => {
    if (!meetingSeries) return false;
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    return meetings[0]?.id === meeting.id;
  };

  const rerenderWithNewMeeting = newMeetingId => {
    history.push(`/meetings/${meetingSeries.id}/meeting/${newMeetingId}`);
    fetchMeeting();
  };

  const handlePreviousMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const previousMeetingId =
      meetings[meetings.findIndex(m => m.id === meeting.id) - 1]?.id;
    rerenderWithNewMeeting(previousMeetingId);
  }, [meetingSeries, meeting]);

  const handleNextMeeting = useCallback(() => {
    const meetings = meetingSeries?.cpsMeeting_groupCpsMeeting;
    const nextMeetingId =
      meetings[meetings.findIndex(m => m.id === meeting.id) + 1]?.id;
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
      <Box
        spacing={2}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ModalAlert
          title={t('Delete') + (meeting ? ` ${meeting.title}` : '')}
          message={t('Are you sure you want to delete this meeting?')}
          closeAlert={() => setOpenDeleteModal(false)}
          open={openDeleteModal}
          action={handleDelete}
        />
        <IconButtonWithTooltip
          id={'udpRecord-MeetingControls-FirstMeeting'}
          udprecordid={'udpRecord-MeetingControls-FirstMeeting'}
          icon={SkipPrevious}
          title={t('First Meeting')}
          disabled={isFirstMeeting()}
          onClick={handleFirstMeeting} // Assuming this should not be clickable when disabled
        />
        <IconButtonWithTooltip
          id={'udpRecord-MeetingControls-PreviousMeeting'}
          udprecordid={'udpRecord-MeetingControls-PreviousMeeting'}
          icon={ArrowBackIosNewOutlined}
          title={t('Previous Meeting')}
          disabled={isFirstMeeting()}
          onClick={handlePreviousMeeting} // Replace with the correct function if needed
        />
        <IconButtonWithTooltip
          id={'udpRecord-MeetingControls-NextMeeting'}
          udprecordid={'udpRecord-MeetingControls-NextMeeting'}
          icon={ArrowForwardIosOutlined}
          title={t('Next Meeting')}
          disabled={isLastMeeting}
          onClick={handleNextMeeting}
        />
        <IconButtonWithTooltip
          id={'udpRecord-MeetingControls-LastMeeting'}
          udprecordid={'udpRecord-MeetingControls-LastMeeting'}
          icon={SkipNext}
          title={t('Last Meeting')}
          disabled={isLastMeeting}
          onClick={handleLastMeeting} // Assuming this should not be clickable when disabled
        />
        {/* <IconButtonWithTooltip
          icon={Delete}
          title={hasMeetingItems ? "Cannot Delete Meeting With Meeting Items" : "Delete Meeting"}
          disabled={hasMeetingItems}
          onClick={() => setOpenDeleteModal(true)}
        /> */}

        <EditMeetingSideSheet
          initialMeeting={meeting}
          fetchMeeting={fetchMeeting}
          open={openEditMeetingSideSheet}
          onClose={() => setOpenEditMeetingSideSheet(false)}
        />

        <Box
          onClick={setOpenEditMeetingSideSheet}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '10px',
          }}
          id={'udpRecord-MeetingControls-EditMeeting'}
          udprecordid={'udpRecord-MeetingControls-EditMeeting'}
        >
          <IconButtonWithTooltip icon={Edit} title={t('Edit Meeting')} />{' '}
          {t('Edit Meeting')}
        </Box>
        <Box sx={{ marginLeft: '10px' }}>
          {primaryActionButton && (
            <PrimaryActionButton
              onClick={primaryActionFunction}
              disabled={
                primaryActionButton?.id ==
                'udpRecord-Meeting-primaryActionButtonMinutes'
                  ? !isLastMeeting
                  : false
              }
              icon={primaryActionButton?.icon}
              id={primaryActionButton?.id}
              udprecordid={primaryActionButton?.udprecordid}
            >
              <Typography variant='subtitle'>{primaryActionButton?.title}</Typography>
            </PrimaryActionButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MeetingControls;
