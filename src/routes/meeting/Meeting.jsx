import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useUser,
  PrimaryActionButton,
  SubHeaderAction,
  PrimaryActionHeader,
  FluentTabPanel,
  apiMutate,
  useAxiosGet,
} from 'unity-fluent-library';
import {
  EditIcon,
  AddIcon,
  Rotate90ClockwiseIcon,
  LocationIcon,
  SearchCalendarIcon,
} from '@fluentui/react-icons';
import { Typography, Box } from '@material-ui/core';
import MeetingHeader from './MeetingHeader';
import MinutesTab from './MinutesTab';
import AttendeesTab from './AttendeesTab';
import CorrespondenceTab from './CorrespondenceTab';

import EditAttendeesSideSheet from './EditAttendeesSideSheet';
import AddMeetingItemSideSheet from './AddMeetingItemSideSheet';
const Meeting = (props) => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingId, setMeetingId] = useState(params?.meetingId || null);
  const [meetingAttendeeMeeting, setMeetingAttendeeMeeting] = useState([]);
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  // const [meeting, setMeeting] = useState();
  // const [meetingAttendeeMeeting, setAttendees] = useState([]);
  const [crumbData, setCrumbData] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const user = useUser();
  const [newBusiness, setNewBusiness] = useState([]);
  const [oldBusiness, setOldBusiness] = useState([]);
  const tabList = [
    {
      label: 'Minutes',
      action: () => setMinutesOpen(!minutesOpen),
      buttonLabel: 'Add Meeting Item',
    },
    {
      label: 'Attendees',
      action: () => setAttendeesOpen(!attendeesOpen),
      buttonLabel: 'Manage Attendees of This Meeting',
    },
    {
      label: 'Correspondence',
    },
  ];


  const [{ data: meeting }, refetchMeeting] = useAxiosGet(
    process.env.REACT_APP_PRODUCTIVITY_API_BASE,
    `cpsmeeting/${meetingId}/full`,
    {},
  );

  const [{ data: series }, refetchSeries] = useAxiosGet(
    process.env.REACT_APP_PRODUCTIVITY_API_BASE,
    `cpsmeeting_group/${meeting?.group_id ?? ''}/full`,
    {},
    !!!meeting?.group_id
  );

  const [{ data: meetingItems }, refetchMeetingItems] = useAxiosGet(
    process.env.REACT_APP_PRODUCTIVITY_API_BASE,
    `cpsmeeting_item`,
    {},
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const chipIcons = {
    location: LocationIcon,
    date: SearchCalendarIcon,
    time: Rotate90ClockwiseIcon
  }

  function replaceNullWithNo(obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key] === null ? "no" : obj[key];
      }
    }
    return newObj;
  };

  const formatResponseData = (meeting) => {
    // const { data } = response;
    // const { cpsMeetingCpsMeeting_group, title, location, meeting_number, date } = data;
    const crumbData = [meeting.cpsMeetingCpsMeeting_group.name, meeting.title];
    const formattedDate = new Date(meeting.date).toLocaleDateString();

    const chipData = [
      { text: `#${String(meeting.meeting_number).padStart(3, '0')}`, icon: <p>#</p> },
      { text: meeting.location, icon: chipIcons.location },
      { text: formattedDate, icon: chipIcons.date }
    ];

    return { crumbData, chipData };
  };

  function filterAttendees(meetingAttendees, meetingAttendeeMeeting) {
    if (!meetingAttendees || !meetingAttendeeMeeting) {
      return [];
    }
    // Create a Set of attendee_id values from the smallerList for quick lookup
    const attendeeIds = new Set(meetingAttendeeMeeting.map(obj => obj.attendee_id));

    // Filter the objects from the biggerList
    const filteredList = meetingAttendees.filter(obj => attendeeIds.has(obj.id));

    return filteredList;
  };

  const sortBusinessItems = () => {
    const formattedDates = meetingItems.map(item => {
      return {
        ...item,
        due_date: new Date(item.due_date).toLocaleDateString(),
      }
    });
    const newBusiness = [];
    const oldBusiness = [];

    formattedDates.forEach(item => {
      if (item.meeting_created === meeting?.id && item.group_id === meeting?.group_id) {
        newBusiness.push(item);
      } else if (item.group_id === meeting?.group_id && new Date(item.open_date) < new Date(meeting?.date)) {
        oldBusiness.push(item);
      }
    });

    setNewBusiness(newBusiness);
    setOldBusiness(oldBusiness);
  };

  const setParsedAttendees = () => {
    if (series && meeting) {

      const meetingAttendees = series.cpsMeeting_groupCpsMeeting_attendee.map((attendee) => ({
        ...attendee,
        name: attendee.first_name + " " + attendee.last_name
      }));
      const meetingAttendeeMeeting = meeting.cpsMeetingCpsMeeting_attendee_meeting;

      setMeetingAttendees(meetingAttendees)

      const filteredGroupAttendees = filterAttendees(meetingAttendees, meetingAttendeeMeeting);
      if (!filteredGroupAttendees.length) {
        return {};
      }
      meetingAttendeeMeeting.sort((a, b) => a.id - b.id);
      filteredGroupAttendees.sort((a, b) => a.id - b.id);

      const maxLength = Math.min(meetingAttendeeMeeting.length, filteredGroupAttendees.length);
      const combinedArrays = [];

      for (let i = 0; i < maxLength; i++) {
        const pair = [meetingAttendeeMeeting[i], filteredGroupAttendees[i]];
        combinedArrays.push(pair);
      }

      const mergedAttendees = combinedArrays.map((arr) => {

        return replaceNullWithNo({ ...arr[0], ...arr[1], name: arr[1].first_name + " " + arr[1].last_name })
      });

      const parsedAttendees = mergedAttendees.map((attendee) => { return replaceNullWithNo(attendee) });

      setMeetingAttendeeMeeting(parsedAttendees);
    }
  };

  const setCrumbAndChip = () => {
    const { crumbData, chipData } = formatResponseData(meeting);
    setCrumbData(crumbData);
    setChipData(chipData);
  };

  useEffect(() => {
    if (meetingItems) {
      sortBusinessItems();
    }
    if (series) {
      setParsedAttendees();
    }
    if (meeting) {
      setCrumbAndChip();
    }
  }, [meetingItems, series, meeting]);

  return (
    <Box>
      <SubHeaderAction>
        <MeetingHeader
          chipData={chipData}
          crumbData={crumbData}
          meeting={meeting}
          newBusiness={newBusiness}
          fetchMeeting={refetchMeeting}
        />
        <PrimaryActionHeader
          tabs
          tabList={tabList}
          handleChange={handleTabChange}
          value={tabValue}
          buttonLabel={tabList[tabValue].buttonLabel}
          hidePAB={tabValue === 2}
          handleClick={tabList[tabValue].action}
        />
      </SubHeaderAction>
      <FluentTabPanel value={tabValue} index={0}>
        <MinutesTab
          meeting={meeting}
          oldBusiness={oldBusiness}
          newBusiness={newBusiness}
        />
        <AddMeetingItemSideSheet refetchMeetingItems={refetchMeetingItems} meetingId={meetingId} meetingSeriesId={series?.id} open={minutesOpen} onClose={() => { setMinutesOpen(false) }}></AddMeetingItemSideSheet>
      </FluentTabPanel>
      <FluentTabPanel value={tabValue} index={1}>
        <AttendeesTab meetingAttendeeMeeting={meetingAttendeeMeeting} />
        <EditAttendeesSideSheet fetchMeeting={refetchMeeting} meetingId={meetingId} meetingAttendees={meetingAttendees} meetingAttendeeMeeting={meetingAttendeeMeeting} open={attendeesOpen} onClose={() => { setAttendeesOpen(false) }}></EditAttendeesSideSheet>
      </FluentTabPanel>
      <FluentTabPanel value={tabValue} index={2}>
        <CorrespondenceTab
          meeting={meeting}
          attendees={meetingAttendees}
        />
      </FluentTabPanel>
    </Box >
  );
};

export default Meeting;
