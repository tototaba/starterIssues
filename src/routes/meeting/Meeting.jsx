import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useUser,
  PrimaryActionButton,
  SubHeaderAction,
  PrimaryActionHeader,
  FluentTabPanel,
  apiMutate
} from 'unity-fluent-library';
import {
  EditIcon,
  AddIcon,
  Rotate90ClockwiseIcon,
  LocationIcon,
  SearchCalendarIcon
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
  const [meeting, setMeeting] = useState();
  const [attendees, setAttendees] = useState([]);
  const [crumbData, setCrumbData] = useState([]);
  const [chipData, setChipData] = useState([]);
  // const [meetingItems, setMeetingItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const tabList = [{ label: 'Minutes' }, { label: 'Attendees' }, { label: 'Correspondence' }];
  const user = useUser();
  const [newBusiness, setNewBusiness] = useState([]);
  const [oldBusiness, setOldBusiness] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const chipIcons = {
    location: LocationIcon,
    date: SearchCalendarIcon,
    time: Rotate90ClockwiseIcon
  }

  const fetchMeetingItems = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_item`,
        {
          method: "GET"
        });
      // setMeetingItems(response.data)
      const formattedDates = response.data.map(item => {
        return {
          ...item,
          due_date: new Date(item.due_date).toLocaleDateString(),
        }
      })
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
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMeeting = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting/${meetingId}/full`,
        {
          method: "GET"
        });
      setMeeting(response.data);
      const groupId = response.data.group_id;
      try {
        const series = await apiMutate(
          process.env.REACT_APP_PRODUCTIVITY_API_BASE,
          `cpsmeeting_group/${groupId}/full`,
          {
            method: "GET"
          }
        );

        const groupAttendees = series.data.cpsMeeting_groupCpsMeeting_attendee;
        const attendeeMeeting = response.data.cpsMeetingCpsMeeting_attendee_meeting;

        const filteredGroupAttendees = filterObjects(groupAttendees, attendeeMeeting);
        attendeeMeeting.sort((a, b) => a.id - b.id);
        filteredGroupAttendees.sort((a, b) => a.id - b.id);

        const combinedArrays = Array.from({ length: Math.min(attendeeMeeting.length, filteredGroupAttendees.length) }, (_, i) => [attendeeMeeting[i], filteredGroupAttendees[i]]);
        const mergedAttendees = combinedArrays.map((arr) => {

          return replaceNullWithNo({ ...arr[0], ...arr[1], name: arr[1].first_name + " " + arr[1].last_name })
        });

        const parsedAttendees = mergedAttendees.map((attendee) => { return replaceNullWithNo(attendee) });

        setAttendees(parsedAttendees);
      } catch (error) {
        console.log(error);
      }
      // setMeetingItems(response.data.cpsMeetingCpsMeeting_item_meeting);

      const { crumbData, chipData } = formatResponseData(response);
      setCrumbData(crumbData);
      setChipData(chipData);
    } catch (error) {
      console.log(error);
    }
  };

  function replaceNullWithNo(obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key] === null ? "no" : obj[key];
      }
    }
    return newObj;
  };

  const formatResponseData = (response) => {
    const { data } = response;
    const { cpsMeetingCpsMeeting_group, title, location, meeting_number, date } = data;
    const crumbData = [cpsMeetingCpsMeeting_group.name, title];
    const formattedDate = new Date(date).toLocaleDateString();

    const chipData = [
      { text: `#${String(meeting_number).padStart(3, '0')}`, icon: <p>#</p> },
      { text: location, icon: chipIcons.location },
      { text: formattedDate, icon: chipIcons.date }
    ];

    return { crumbData, chipData };
  };

  function filterObjects(biggerList, smallerList) {
    // Create a Set of attendee_id values from the smallerList for quick lookup
    const attendeeIds = new Set(smallerList.map(obj => obj.attendee_id));

    // Filter the objects from the biggerList
    const filteredList = biggerList.filter(obj => attendeeIds.has(obj.id));

    return filteredList;
  }

  useEffect(() => {
    if (meetingId) {
      fetchMeeting();
      fetchMeetingItems();
    }
  },[]);

  return (
    <Box>
      <SubHeaderAction>
        <MeetingHeader
          chipData={chipData}
          crumbData={crumbData}
          meeting={meeting}
          newBusiness={newBusiness}
          fetchMeeting={fetchMeeting}
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