import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useUser,
  PrimaryActionButton,
  SubHeaderAction,
  PrimaryActionHeader,
  FluentTabPanel,
  apiMutate,
  useAxiosGet,
  useHandleAxiosSnackbar,
} from 'unity-fluent-library';
import {
  EditIcon,
  AddIcon,
  Rotate90ClockwiseIcon,
  LocationIcon,
  SearchCalendarIcon,
  TestParameterIcon,
  DeleteIcon,
  ClockIcon,
  CalendarAgendaIcon,
  MapPin12Icon,
  LinkIcon
} from '@fluentui/react-icons';
import { Typography, Box } from '@material-ui/core';
import MeetingHeader from './MeetingHeader';
import MinutesTab from './MinutesTab';
import AttendeesTab from './AttendeesTab';
import CorrespondenceTab from './CorrespondenceTab';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { CreateCategory } from './Categories/categoriesHelpers';
import { Link } from 'react-router-dom';
import AgendaTab from './AgendaTab';
const Meeting = (props) => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingId, setMeetingId] = useState(params?.meetingId || null);
  const [meetingSeriesId, setMeetingSeriesId] = useState(params?.meetingSeriesId || null);
  const [meetingAttendeeMeeting, setMeetingAttendeeMeeting] = useState([]);
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [crumbData, setCrumbData] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [agendaSidesheetOpen, setAgendaSidesheetOpen] = useState(false);
  const [agendaOrderSidesheetOpen, setAgendaOrderSidesheetOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedMeetingItem, setSelectedMeetingItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [hasMeetingItems, setHasMeetingItems] = useState(false);
  const [meetingDate, setMeetingDate] = useState(null);

  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();

  const tabList = [
    {
      label: 'Minutes',
      action: () => openMeetingItemSideSheet(),
      buttonLabel: 'Add Meeting Item',
    },
    {
      label: 'Attendees',
      action: () => setAttendeesOpen(!attendeesOpen),
      buttonLabel: 'Manage Attendees',
    },
    {
      label: 'Correspondence',
    },
    {
      label: 'Agenda',
      action: () => { setAgendaSidesheetOpen(true) },
      buttonLabel: 'Update Agenda Order',
    },
  ];


  const [{ data: meeting }, refetchMeeting] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting/${meetingId}/full`,
    {},
  );

  const [{ data: series }, refetchSeries] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_group/${meeting?.group_id ?? ''}/full`,
    {},
    !!!meeting?.group_id
  );

  const [{ data: categories }, refetchCategories] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `CpsCategory/${meetingSeriesId}/group`,
    {},
  );

  const [{ data: meetingItems }, refetchMeetingItems] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_item/oldNewBusiness/${meetingId}`,
    {},
  );

  useEffect(() => {
    if (!meeting || !meetingItems) {
      return;
    }
    setHasMeetingItems(meetingItems[1].length > 0)
    const formattedDate = new Date(meeting.date).toLocaleDateString();
    setMeetingDate(formattedDate);
  }, [meeting, meetingItems]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openMeetingItemSideSheet = () => {
    setMinutesOpen(!minutesOpen);
    setIsEdit(false);
    setSelectedMeetingItem(null);
  };

  const chipIcons = {
    location: <MapPin12Icon />,
    date: <CalendarAgendaIcon />,
    time: <ClockIcon />,
    onlineMeeting: <LinkIcon />
  }

  const formatResponseData = (meeting) => {
    const crumbData = [meeting.cpsMeetingCpsMeeting_group?.name, meeting.title];
    const formattedDate = new Date(meeting.date).toLocaleDateString();

    const chipData = [
      { text: `${String(meeting.meeting_number).padStart(3, '0')}`, icon: <p>#</p> },
      { text: meeting.location, icon: chipIcons.location },
      { text: formattedDate, icon: chipIcons.date },
      { text: `${meeting.start_time} - ${meeting.end_time}`, icon: chipIcons.time },
    ];

    meeting.onlineMeetingUrl && chipData.push({ text: "Open in Outlook", href: meeting.onlineMeetingUrl, icon: chipIcons.onlineMeeting, component: "a", clickable: true, target: "_blank" })

    return { crumbData, chipData };
  };

  const setCrumbAndChip = () => {
    const { crumbData, chipData } = formatResponseData(meeting);
    setCrumbData(crumbData);
    setChipData(chipData);
  };

  useEffect(() => {
    if (meeting) {
      setMeetingId(meeting.id);
      setCrumbAndChip();
    }
  }, [series, meeting]);

  const handleCategoryCreate = useCallback(async (newCategory) => {
    try {
      const response = await CreateCategory(newCategory, meetingSeriesId);

      handleSuccessSnackbar("Category created successfully");
      refetchCategories();
      return response.data;
    } catch (error) {
      handleErrorSnackbar(error, "Error creating category");
    }
  }, [meetingSeriesId]);
  return (
    <Box>
      <SubHeaderAction>
        <MeetingHeader
          chipData={chipData}
          crumbData={crumbData}
          meeting={meeting}
          fetchMeeting={refetchMeeting}
          meetingSeries={series}
          refetchSeries={refetchSeries}
          hasMeetingItems={hasMeetingItems}
        />

        <PrimaryActionHeader

          tabList={tabList}
          handleChange={handleTabChange}
          value={tabValue}
          buttonLabel={tabList[tabValue].buttonLabel}
          hidePAB={tabValue === 2}
          handleClick={tabList[tabValue].action}
          secondaryButtons={tabList[tabValue].secondaryButtons}
        />
      </SubHeaderAction>

      <FluentTabPanel value={tabValue} index={0}>
        <MinutesTab
          meeting={meeting}
          setSideSheetOpen={setMinutesOpen}
          setMeetingItem={setSelectedMeetingItem}
          setIsEdit={setIsEdit}
          categories={categories}
          refetchCategories={refetchCategories}
          handleCategoryCreate={handleCategoryCreate}
          isEdit={isEdit}
          selectedMeetingItem={selectedMeetingItem}
          meetingId={meetingId}
          series={series}
          setMinutesOpen={setMinutesOpen}
          minutesOpen={minutesOpen}
          meetingItems={meetingItems}
          refetchMeetingItems={refetchMeetingItems}
          meetingDate={meetingDate}
        />

      </FluentTabPanel>

      <FluentTabPanel value={tabValue} index={1}>
        <AttendeesTab
          meetingAttendeeMeeting={meetingAttendeeMeeting}
          meetingId={meetingId}
          seriesId={meeting?.group_id}
          setAttendeesOpen={setAttendeesOpen}
          attendeesOpen={attendeesOpen}
        />


      </FluentTabPanel>

      <FluentTabPanel value={tabValue} index={2}>
        <CorrespondenceTab
          meeting={meeting}
          attendees={meetingAttendees}
        />
      </FluentTabPanel>
      <FluentTabPanel value={tabValue} index={3}>
        <AgendaTab
          categories={categories}
          meetingId={meetingId}
          meetingSeriesId={meetingSeriesId}
          agendaSidesheetOpen={agendaSidesheetOpen}
          setAgendaSidesheetOpen={setAgendaSidesheetOpen}
          agendaOrderSidesheetOpen={agendaOrderSidesheetOpen}
          setAgendaOrderSidesheetOpen={setAgendaOrderSidesheetOpen}
          handleCategoryCreate={handleCategoryCreate}
        />
      </FluentTabPanel>

    </Box >
  );
};

export default Meeting;
