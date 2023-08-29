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

const Meeting = (props) => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingId, setMeetingId] = useState(params?.meetingId || null);
  const [attendees, setAttendees] = useState([]);
  const [crumbData, setCrumbData] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const tabList = [{ label: 'Minutes' }, { label: 'Attendees' }, { label: 'Correspondence' }];
  const user = useUser();
  const [newBusiness, setNewBusiness] = useState([]);
  const [oldBusiness, setOldBusiness] = useState([]);

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

  function filterObjects(biggerList, smallerList) {
    if (!biggerList || !smallerList) {
      return [];
    }
    // Create a Set of attendee_id values from the smallerList for quick lookup
    const attendeeIds = new Set(smallerList.map(obj => obj.attendee_id));

    // Filter the objects from the biggerList
    const filteredList = biggerList.filter(obj => attendeeIds.has(obj.id));

    return filteredList;
  };

  const sortOldNewBusiness = () => {
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
      console.log(series);
      const groupAttendees = series.cpsMeeting_groupCpsMeeting_attendee;
      const attendeeMeeting = meeting.cpsMeetingCpsMeeting_attendee_meeting;
  
      const filteredGroupAttendees = filterObjects(groupAttendees, attendeeMeeting);
      if (!filteredGroupAttendees.length) {
        return {};
      }
      attendeeMeeting.sort((a, b) => a.id - b.id);
      filteredGroupAttendees.sort((a, b) => a.id - b.id);
  
      const combinedArrays = Array.from({ length: Math.min(attendeeMeeting.length, filteredGroupAttendees.length) }, (_, i) => [attendeeMeeting[i], filteredGroupAttendees[i]]);
      const mergedAttendees = combinedArrays.map((arr) => {
  
        return replaceNullWithNo({ ...arr[0], ...arr[1], name: arr[1].first_name + " " + arr[1].last_name })
      });
  
      const parsedAttendees = mergedAttendees.map((attendee) => { return replaceNullWithNo(attendee) });
  
      setAttendees(parsedAttendees);
    }
  };

  const setCrumbAndChip = () => {
    const { crumbData, chipData } = formatResponseData(meeting);
    setCrumbData(crumbData);
    setChipData(chipData);
  };

  useEffect(() => {
    if (meetingItems) {
      sortOldNewBusiness();
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
          buttonLabel='Add Meeting Item'
          hidePAB={tabValue != 0 ?? tabValue == 0}
        />
      </SubHeaderAction>
      <FluentTabPanel value={tabValue} index={0}>
        <MinutesTab 
          meeting={meeting}
          oldBusiness={oldBusiness}
          newBusiness={newBusiness}
        />
      </FluentTabPanel>
      <FluentTabPanel value={tabValue} index={1}>
        <AttendeesTab attendees={attendees} />
      </FluentTabPanel>
      <FluentTabPanel value={tabValue} index={2}>
        <CorrespondenceTab meeting={meeting} />
      </FluentTabPanel>
    </Box>
  );
};

export default Meeting;