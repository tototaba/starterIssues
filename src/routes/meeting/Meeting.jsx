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
  IconButtonWithTooltip,
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
  LinkIcon,
} from '@fluentui/react-icons';
import { Typography, Box } from '@material-ui/core';
import { Add, Assignment, People, Edit, Delete } from '@mui/icons-material';
import MeetingHeader from './MeetingHeader';
import MinutesTab from './MinutesTab';
import AttendeesTab from './AttendeesTab';
import CorrespondenceTab from './CorrespondenceTab';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { CreateCategory } from './Categories/categoriesHelpers';
import { Link } from 'react-router-dom';
import AgendaTab from './AgendaTab';
import { useTranslation } from 'react-i18next';

const Meeting = props => {
  const { match, ...other } = props;
  const { params } = match;
  const [meetingId, setMeetingId] = useState(params?.meetingId || null);
  const [meetingSeriesId, setMeetingSeriesId] = useState(
    params?.meetingSeriesId || null
  );
  const [meetingAttendeeMeeting, setMeetingAttendeeMeeting] = useState([]);
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [crumbData, setCrumbData] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [agendaSidesheetOpen, setAgendaSidesheetOpen] = useState(false);
  const [agendaOrderSidesheetOpen, setAgendaOrderSidesheetOpen] =
    useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedMeetingItem, setSelectedMeetingItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [hasMeetingItems, setHasMeetingItems] = useState(false);
  const [meetingDate, setMeetingDate] = useState(null);
  const { t } = useTranslation();
  const { handleErrorSnackbar, handleSuccessSnackbar } =
    useHandleAxiosSnackbar();
  var user = useUser();

  const tabList = [
    {
      label: t('Minutes'),
      action: () => openMeetingItemSideSheet(),
      buttonLabel: t('Add Meeting Item'),
    },
    {
      label: t('Attendees'),
      action: () => setAttendeesOpen(!attendeesOpen),
      buttonLabel: t('Manage Attendees'),
    },
    {
      label: t('Correspondence'),
    },
    {
      label: t('Agenda'),
      action: () => {
        setAgendaSidesheetOpen(true);
      },
      buttonLabel: t('Update Agenda Order'),
    },
  ];

  const openMeetingItemSideSheet = () => {
    setMinutesOpen(!minutesOpen);
    setIsEdit(false);
    setSelectedMeetingItem(null);
  };

  const handlePrimaryAction = () => {
    switch (tabValue) {
      case 0: // Minutes
        setMinutesOpen(!minutesOpen);
        setIsEdit(false);
        setSelectedMeetingItem(null);
        break;
      case 1: // Attendees
        setAttendeesOpen(!attendeesOpen);
        break;
      case 2: // Correspondance
        break;
      case 3: // Agenda
        setAgendaSidesheetOpen(true);
        break;
      default:
      // Handle default case if necessary
    }
  };

  const [{ data: meeting, loading: fetchMeetingLoading }, refetchMeeting] =
    useAxiosGet(
      process.env.REACT_APP_MEETING_MINUTES_API_BASE,
      `cpsmeeting/${meetingId}/full`,
      {}
    );

  const [{ data: series, loading: fetchSeriesLoading }, refetchSeries] =
    useAxiosGet(
      process.env.REACT_APP_MEETING_MINUTES_API_BASE,
      `cpsmeeting_group/${meeting?.group_id ?? ''}/full`,
      {},
      !!!meeting?.group_id
    );

  const [{ data: categories }, refetchCategories] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `CpsCategory/${meetingSeriesId}/group`,
    {}
  );

  const [
    { data: meetingItems, loading: fetchMeetingItemsLoading },
    refetchMeetingItems,
  ] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_item/oldNewBusiness/${meetingId}`,
    {}
  );

  useEffect(() => {
    if (!meeting || !meetingItems) {
      return;
    }
    setHasMeetingItems(meetingItems[1].length > 0);
    const formattedDate = new Date(meeting.date).toLocaleDateString();
    setMeetingDate(formattedDate);
  }, [meeting, meetingItems]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const chipIcons = {
    location: <MapPin12Icon />,
    date: <CalendarAgendaIcon />,
    time: <ClockIcon />,
    onlineMeeting: <LinkIcon />,
  };

  const formatResponseData = meeting => {
    const crumbData = [meeting.cpsMeetingCpsMeeting_group?.name, meeting.title];
    const formattedDate = new Date(meeting.date).toLocaleDateString();

    const chipData = [
      {
        text: `${String(meeting.meeting_number).padStart(3, '0')}`,
        icon: <p>#</p>,
      },
      { text: meeting.location, icon: chipIcons.location },
      { text: formattedDate, icon: chipIcons.date },
      {
        text: `${meeting.start_time} - ${meeting.end_time}`,
        icon: chipIcons.time,
      },
    ];

    meeting.onlineMeetingUrl &&
      chipData.push({
        text: t('Open in Outlook'),
        href: meeting.onlineMeetingUrl,
        icon: chipIcons.onlineMeeting,
        component: 'a',
        clickable: true,
        target: '_blank',
      });

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

  const handleCategoryCreate = useCallback(
    async newCategory => {
      try {
        const response = await CreateCategory(newCategory, meetingSeriesId);

        handleSuccessSnackbar(t('Category created successfully'));
        refetchCategories();
        return response.data;
      } catch (error) {
        handleErrorSnackbar(error, t('Error creating category'));
      }
    },
    [meetingSeriesId]
  );

  const primaryActionButton = useMemo(() => {
    switch (tabValue) {
      case 0: // Minutes
        return {
          id: 'udpRecord-Meeting-primaryActionButtonMinutes',
          udpRecordId: 'udpRecord-Meeting-primaryActionButtonMinutes',
          icon: <Add/>,
          title: 'Add Item',
        };
      case 1: // Attendees
        return {
          id: 'udpRecord-Meeting-primaryActionButtonAttendees',
          udpRecordId: 'udpRecord-Meeting-primaryActionButtonAttendees',
          icon: <People/>,
          title: t('Manage Attendees'),
        };
      case 3: // Agenda
        return {
          id: 'udpRecord-Meeting-primaryActionButtonAgenda',
          udpRecordId: 'udpRecord-Meeting-primaryActionButtonAgenda',
          icon: <Assignment/>,
          title: t('Update Agenda'),
        };
      default:
        return null;
    }
  }, [tabValue]);

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
          meetingItems={meetingItems}
          primaryActionFunction={handlePrimaryAction}
          primaryActionButton={primaryActionButton}
          user={user}
        />

        <PrimaryActionHeader
          hidePAB={true}
          tabList={tabList}
          handleChange={handleTabChange}
          value={tabValue}
          buttonLabel={tabList[tabValue].buttonLabel}
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
          fetchDataLoading={
            fetchMeetingItemsLoading ||
            fetchMeetingLoading ||
            fetchSeriesLoading
          }
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
          refetchMeeting={refetchMeeting}
        />
      </FluentTabPanel>

      <FluentTabPanel value={tabValue} index={2}>
        <CorrespondenceTab meeting={meeting} attendees={meetingAttendees} />
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
    </Box>
  );
};

export default Meeting;
