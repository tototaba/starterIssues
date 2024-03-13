import React from 'react';
import { Typography, Box } from '@material-ui/core';
import MeetingControls from './MeetingControls';
import { useTranslation } from 'react-i18next';

const MeetingHeader = props => {
  const {
    meeting,
    chipData,
    crumbData,
    fetchMeeting,
    newBusiness,
    meetingSeries,
    refetchSeries,
    hasMeetingItems,
    meetingItems,
    primaryActionFunction,
    primaryActionButton,
    user,
  } = props;
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        paddingLeft: '10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gridTemplateRows: 'repeat(3, auto)',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gridColumn: '1 / 1',
          gridRow: '1 / 2',
          borderBottom: '1px solid #ccc',
        }}
      >
        <Box style={{ fontWeight: 'bold', fontSize: '24px' }}>
          {crumbData[1]}
        </Box>
        {/* Meeting Title */}
        <MeetingControls
          meeting={meeting}
          fetchMeeting={fetchMeeting}
          newBusiness={newBusiness}
          meetingSeries={meetingSeries}
          refetchSeries={refetchSeries}
          hasMeetingItems={hasMeetingItems}
          primaryActionFunction={primaryActionFunction}
          primaryActionButton={primaryActionButton}
        />
      </Box>

      {Box && chipData && meetingItems && user && (
        <Box sx={{ gridColumn: '1 / 1', gridRow: '2 / 4', paddingBottom:'10px', borderBottom: '1px solid #ccc', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(2, auto)', gap: '5px'}}>
          {Box && chipData[2] && (
            <Box sx={{ gridColumn: '1 / 3', gridRow: '1 / 2', display: "flex", flexDirection: "row", alignItems: 'center', width: "100%" }}>
              {t('Date')}: <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '5px' }}>{chipData?.[2]?.text}</Typography>
            </Box>
          )}
          {Box && chipData[3] && (
          <Box sx={{ gridColumn: '1 / 3', gridRow: '2 / 3', display: "flex", flexDirection: "row", alignItems: 'center', width: "100%" }}>
            {t('Time')}: <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '5px' }}>{chipData?.[3]?.text}</Typography>
          </Box>
          )}
          {Box && chipData[0] && (
          <Box sx={{ gridColumn: '3 / 5', gridRow: '1 / 2', paddingLeft: '5px', display: "flex", flexDirection: "row", alignItems: 'center', width: "100%" }}>
            {t('Occurance')}: <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '5px' }}>{chipData?.[0]?.text}</Typography>
          </Box>
          )}
          {Box && chipData[1] && (
          <Box sx={{ gridColumn: '3 / 5', gridRow: '2 / 3', paddingLeft: '5px', display: "flex", flexDirection: "row", alignItems: 'center', width: "100%" }}>
            {t('Location')}: <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '5px' }}>{chipData?.[1]?.text}</Typography>
          </Box>
          )}
          <Box sx={{ gridColumn: '3 / 5', gridRow: '1 / 3', borderLeft: '1px solid #ccc',}}></Box>
          <Box sx={{ gridColumn: '5 / 5', gridRow: '1 / 3', borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
            <Typography variant="body1" style={{ fontSize: '24px' }}>{meeting?.cpsMeetingCpsMeeting_attendee_meeting?.length}</Typography>
            <Typography variant="body1">{t('Attendees')}</Typography>
          </Box>
          <Box
            sx={{
              gridColumn: '6 / 6',
              gridRow: '1 / 3',
              borderLeft: '1px solid #ccc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <Typography variant="body1" style={{ fontSize: '24px' }}>
              {meetingItems?.[1]?.length}
            </Typography>
            <Typography variant="body1">{t('New Items')}</Typography>
          </Box>
          <Box
            sx={{
              gridColumn: '7 / 7',
              gridRow: '1 / 3',
              borderLeft: '1px solid #ccc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <Typography variant="body1" style={{ fontSize: '24px' }}>
              {meetingItems?.[0]?.length}
            </Typography>
            <Typography variant="body1">{t('Old Items')}</Typography>
          </Box>
          <Box
            sx={{
              gridColumn: '8 / 8',
              gridRow: '1 / 3',
              borderLeft: '1px solid #ccc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" style={{ fontSize: '24px' }}>
              {
                meetingItems?.[0]?.filter(item => item.owner === user.name)
                  ?.length
              }
            </Typography>
            <Typography variant="body1">{t('My Items')}</Typography>
          </Box>
        </Box>
      )}

      {/* <ChipHeader variant="outlined" items={chipData} /> */}
    </Box>
  );
};

export default MeetingHeader;
