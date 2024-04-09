import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  SideSheet,
  Form,
  Field,
  FluentDatePicker,
  FluentTimePicker,
  FluentTextFieldAutoComplete,
  apiMutate,
  useHandleAxiosSnackbar,
  AmbientStepper,
  FluentButton,
  useUser,
  useAxiosMutate,
  useAgGridApi,
  useOutlook,
  FluentToggle
} from "unity-fluent-library"
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
} from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import CreateMeetingSeriesSideSheet from '../meetingSeries/CreateMeetingSeriesSideSheet';
import AgendaOrderForm from './AgendaOrderForm';
const CreateMeetingSideSheet = (props) => {
  const {
    open,
    onClose,
    tenantUsers,
    meetingSeries,
  } = props;
  const formRef = useRef(null);
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const { gridApi, gridColumnApi, onGridReady } = useAgGridApi();
  const [selectedMeetingSeries, setSelectedMeetingSeries] = useState(meetingSeries || null);
  const steps = ['Select or Create a Meeting Series', 'Create Meeting', "Create Meeting Agenda"]; // Define your steps
  const [activeStep, setActiveStep] = useState(0); // State to track active step
  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  const [meetingCount, setMeetingCount] = useState(0);
  const [agenda_categoriesToCreate, setAgenda_categoriesToCreate] = useState([]);
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [makeMeetingInOutlook, setMakeMeetingInOutlook] = useState(false);
  const user = useUser();
  const [outlookAccessToken, setOutlookAccessToken] = useState(null);
  const { getAccessToken, invalidateUserSession, login, isUserSignedIn } = useOutlook(process.env.REACT_APP_MINUTES_URL + "/callback");
  const [isFirstFormValid, setIsFirstFormValid] = useState(false);
  const [isSecondFormValid, setIsSecondFormValid] = useState(false);

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

  function formatNumberWithThreeDigits(number) {
    let numberStr = number.toString();

    if (numberStr.length < 3) {
      while (numberStr.length < 3) {
        numberStr = '0' + numberStr;
      }
    }

    return numberStr;
  }
  const fetchMeetingCount = async () => {
    try {
      const meetingSeriesId = formRef.current.values.MeetingSeries.id;
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `CpsMeeting/${meetingSeriesId}/count`,
        {
          method: "GET"
        });
      const count = response.data + 1;
      return formatNumberWithThreeDigits(count);
    } catch (error) {
      return 1;
    }
  }
  function onRowDragEnd(e) {
    const newOrderedCategories = e.node.parent.allLeafChildren.map((node, index) => {
      node.data.order_number = index + 1;
      return node.data;
    })

    setOrderedCategories(newOrderedCategories);
  }

  const searchData = useMemo(() => ({
    data: {
      pageNumber: 1,
      pageSize: 30,
      orderElements: [
        {
          sortColumn: "id",
          sortDirection: "ASC",
        },
      ],
      filterElements: [
        {
          searchField: "tenant_id",
          searchValue: user.currentTenantId,
          searchOperator: "=",
        },
      ],
    },
    method: "POST",
  }), [user]);

  const [
    {
      data: series,
      loading: loading,
      error: error,
    },
    fetchMeetingSeries,
  ] = useAxiosMutate(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    "cpsMeeting_group/search",
    searchData
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMeetingSeries();
      } catch (error) {
        console.error('Error fetching meeting attendees:', error);
      }
    };
    fetchData();
  }, [fetchMeetingSeries]);

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const numMeetings = await fetchMeetingCount();
    setMeetingCount(numMeetings);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const saveMeetingWithAttendees = useCallback(async (values, agenda_categoriesToCreate) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    /*let startTime = values.startTime.toLocaleTimeString(undefined, options);
    let endTime = values.endTime.toLocaleTimeString(undefined, options);

    */
    //24hr to 12hr
    const startTimeString = values.startTime;
    const [startHours, StartMinutes] = startTimeString.split(":");
    const startToday = new Date();
    const fullStartTime = new Date(startToday.getFullYear(), startToday.getMonth(), startToday.getDate(), startHours, StartMinutes);
    const StartTimeStringFormated = fullStartTime.toLocaleTimeString(undefined, options);

    const endTimeString = values.endTime;
    const [endHours, endMinutes] = endTimeString.split(":");
    const endToday = new Date();
    const fullendTime = new Date(endToday.getFullYear(), endToday.getMonth(), endToday.getDate(), endHours, endMinutes);
    const endTimeStringFormated = fullendTime.toLocaleTimeString(undefined, options);

    // Normalize the year number within the date  
    const dateObject = new Date(values.date);  
    let normalizedYear = dateObject.getFullYear();  
    
    // Set the year boundaries  
    const minYear = 2000;  
    const maxYear = 9999;  
    
    // Check if the year is outside the boundaries and adjust if necessary  
    if (normalizedYear < minYear) {  
      normalizedYear = minYear;  
    } else if (normalizedYear > maxYear) {  
      normalizedYear = maxYear;  
    }  
    
    // Create a new date object with the normalized year while keeping the original month and day  
    const normalizedDate = new Date(dateObject.setFullYear(normalizedYear));  
    
    // Format the normalized date as needed, e.g., toISOString, toLocaleDateString, etc.  
    // For this example, let's assume you want to keep the date in ISO format (YYYY-MM-DD)  
    const normalizedDateString = normalizedDate.toISOString().split('T')[0]; 
    const meeting = {
      Group_id: values.MeetingSeries.id,
      Meeting_number: values.MeetingNumber,
      Title: values.Title,
      Status: "Active",
      Location: values.Location,
      //Date: values.date,
      Date: normalizedDateString,
/*
      Start_time: startTime,
      End_time: endTime,
      */
      Start_time: StartTimeStringFormated,
      End_time: endTimeStringFormated,
    }

    let meetingAgendaCategories;
    if (orderedCategories.length == 0) {
      meetingAgendaCategories = agenda_categoriesToCreate.map((category, index) => {
        return {
          category_id: category.agendaCategory.id,
          length_in_minutes: category.length_in_minutes,
          order_number: index + 1
        }
      });
    } else {
      meetingAgendaCategories = orderedCategories.map((category, index) => {
        return {
          category_id: category.agendaCategory.id,
          length_in_minutes: category.length_in_minutes,
          order_number: index + 1
        }
      });
    }

    const meetingAttendees = values.users.map((user) => mapUserToAttendee(user, values.MeetingNumber, values.MeetingSeries.id));

    if (makeMeetingInOutlook && (!outlookAccessToken || !isUserSignedIn())) {
      login();
    }

    const data = {
      data: {
        CpsMeeting: meeting,
        CpsMeeting_attendees: meetingAttendees,
        CpsMeeting_agenda_categories: meetingAgendaCategories,
      },
      method: "POST",
      headers: makeMeetingInOutlook ? {
        "OutlookAccessToken": outlookAccessToken
      } : {}
    }
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/withAttendees?createInOutlook=${makeMeetingInOutlook}&isOnlineMeeting=${values.onlineMeeting}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }, [agenda_categoriesToCreate, orderedCategories, outlookAccessToken, makeMeetingInOutlook])

  function mapUserToAttendee(user, meetingNumber, meetingSeriesId) {
    const attendee = {
      group_id: meetingSeriesId,
      // group_id: selectedMeetingSeries.id, // Assuming company_id corresponds to group_id
      user_id: user.unityId,
      email: user.email,
      first_name: user.givenName,
      last_name: user.surname,
      company: null, // You can update this if needed
      meeting_number: meetingNumber, // You can update this if needed
      is_guest: 0, // Default to 0 for user
    };
    return attendee;
  }

  const handleSubmit = async (values) => {
    try {
      setSelectedMeetingSeries(values.MeetingSeries);
      const response = await saveMeetingWithAttendees(values, agenda_categoriesToCreate);
      const meetingName = response.data.createdMeetingAttendeeMeetingRecords.Title;
      handleSuccessSnackbar(`Successfully Created Meeting`)
      onClose();
      setActiveStep(0);
    } catch (error) {
      if (error?.response?.data == "Error Creating Agenda") {
        handleErrorSnackbar("", error.response.data + ", Create Agenda in Agenda Tab")
        onClose();
        return;
      }
      handleErrorSnackbar("", "Could Not Create Meeting.")
    }
  };

  const getInitialLocation = () => {
    if (selectedMeetingSeries?.cpsMeeting_groupCpsMeeting?.length > 0) {
      return selectedMeetingSeries?.cpsMeeting_groupCpsMeeting[selectedMeetingSeries?.cpsMeeting_groupCpsMeeting?.length - 1]?.location
    }
    return ""
  };

  const handleCreateMeetingSeries = async (values) => {
    const data = {
      data: {
        name: values.Title,
        tenant_id: user.currentTenantId,
      },
      method: "POST"
    }
    try {
      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        "CpsMeeting_group",
        data
      );
      const createdSeries = response.data;
      fetchMeetingSeries();
      handleSuccessSnackbar(`Successfully Created Meeting Series`)
      setSelectedMeetingSeries(createdSeries);
      setCreateSeriesOpen(false);
    } catch (error) {
      handleErrorSnackbar("Could Not Create Meeting Series.")
    }
  };

  const handleClose = () => {
    onClose();
    setActiveStep(0);
    // setSelectedMeetingSeries(null);
  };

  const addToAgendaCategories = useCallback((formValues) => {

    const agendaCategory = {
      length_in_minutes: formValues.Length.value,
      title: formValues.category.title,
      agendaCategory: formValues.category,
    }

    const categoryAlreadyAdded = agenda_categoriesToCreate.some(item => item.agendaCategory.id === agendaCategory.agendaCategory.id);

    if (categoryAlreadyAdded) {
      handleErrorSnackbar("", "Category already added to agenda");
      return;
    }

    setAgenda_categoriesToCreate((prevAgendaCategories) => {
      const newAgendaCategories = [...prevAgendaCategories];
      newAgendaCategories.push(agendaCategory);
      return newAgendaCategories;
    });
  }, [setAgenda_categoriesToCreate, agenda_categoriesToCreate]);

  const removeFromAgendaCategories = useCallback(() => {
    setAgenda_categoriesToCreate((prevAgendaCategories) => {
      const newAgendaCategories = [...prevAgendaCategories];
      newAgendaCategories.pop();
      return newAgendaCategories;
    });
  }, [setAgenda_categoriesToCreate]);

  function onRowDragEnd(e) {
    const newOrderedCategories = e.node.parent.allLeafChildren.map((node, index) => {
      node.data.order_number = index + 1;
      return node.data;
    })

    setOrderedCategories(newOrderedCategories);
  }

  const handleSwitchChange = useCallback((event) => {
    setMakeMeetingInOutlook(event.target.checked);
  }, [setMakeMeetingInOutlook])

  const validationSchema = {
    MeetingSeries: (value) => {
      if (!value || value === null) {
        setIsFirstFormValid(false);
        return 'Meeting Series is required';
      }
      setIsFirstFormValid(true);
      return undefined; // No validation error
    },

    Title: (value) => {
      if (!value || value === null) {
        setIsSecondFormValid(false);
        return 'Title is required';
      }
   
      return undefined; // No validation error
    },
    users: (value) => {
      if (!value || value.length === 0) {
        setIsSecondFormValid(false);
        return 'Attendees are required';
      }
      return undefined; // No validation error
    },
    date: (value) => {
      if (!value || value === null) {
        setIsSecondFormValid(false);
        return 'Date is required';
      }
      return undefined; // No validation error
    },
    startTime: (value) => {
      if (!value || value === null) {
        setIsSecondFormValid(false);
        return 'Start Time is required';
      }
      return undefined; // No validation error
    },
    endTime: (value) => {
      if (!value || value === null) {
        setIsSecondFormValid(false);
        return 'End Time is required';
      }
      return undefined; // No validation error
    }
  };

  const formSections = [
    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Field
        component={FluentTextFieldAutoComplete}
        label="Meeting Series"
        id="MeetingSeries"
        udprecordid="udpRecord-CreateMeetingSideSheet-MeetingSeries"
        name="MeetingSeries"
        variant="outlined"
        margin="none"
        size="large"
        fullWidth
        options={series?.pageList}
        optionKey={'name'}
        required
        initialValue={selectedMeetingSeries || null}
        style={{ width: "379px" }}
      />
      <p>OR</p>
      <Box sx={{ padding: "1rem" }}>
        <Button 
          variant="contained" 
          onClick={() => { setCreateSeriesOpen(true) }}
          id="udpRecord-CreateMeetingSideSheet-CreateNewMeetingSeries"
          udprecordid="udpRecord-CreateMeetingSideSheet-CreateNewMeetingSeries"
        >
          Create New Meeting Series
        </Button>
      </Box>
    </Box>,

    // Step 2
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "1rem" }}>
        <Field
          component={TextField}
          label="Title"
          id="Title"
          name="Title"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
        />
        <Field
          component={TextField}
          label="Meeting Number"
          id="MeetingNumber"
          name="MeetingNumber"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
          disabled
          initialValue={meetingCount}
        />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "5fr 0fr 3fr", gap: "1rem", alignItems: "center" }} >

        <Field
          component={TextField}
          label="Location"
          id="Location"
          name="Location"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          initialValue={getInitialLocation()}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", left: "-170px", top: "4px", maxWidth: 0 }}>
          <Field
            label={"Online Meeting"}
            component={FluentToggle}
            id="onlineMeeting"
            name="onlineMeeting"
          />
          <Box sx={{ whiteSpace: "nowrap" }}>Online Meeting</Box>
        </Box>

        <Field
          label={"Date"}
          component={FluentDatePicker}
          id="date"
          name="date"
          variant="outlined"
          margin="normal"
          size="small"
          required
        />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} >

        <Field
          label={"Start Time"}
          //type='time'
          //component={TextField}
          component={FluentTimePicker}
          id="startTime"
          name="startTime"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
          InputLabelProps={{
            shrink: true,
          }}
        // initialValue={}
        />
        <Field
          label={"End Time"}
          //type='time'
          //component={TextField}
          component={FluentTimePicker}
          id="endTime"
          name="endTime"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
          InputLabelProps={{
            shrink: true,
          }}
        // initialValue={}
        />
      </Box >
      <Box>
        <Field
          label={"Attendees"}
          component={FluentTextFieldAutoComplete}
          id="users"
          udprecordid="udpRecord-CreateMeetingSideSheet-users"
          name="users"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          isMultiple
          options={tenantUsers}
          optionKey={'displayName'}
          required

        // initialValue={ }
        />
        {(isUserSignedIn() &&
          <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
            <FluentToggle
              onChange={handleSwitchChange}
            />
            <Typography>
              Create Meeting in Outlook
            </Typography>
          </div>
        )}
      </Box>

    </Box>,

    // step 3 
    <AgendaOrderForm
      meetingSeriesId={formRef.current?.values?.MeetingSeries?.id}
      agenda_categories={agenda_categoriesToCreate}
      addToAgendaCategories={addToAgendaCategories}
      removeFromAgendaCategories={removeFromAgendaCategories}
      onRowDragEnd={onRowDragEnd}
      formRef={formRef}
    />


  ];
  return (
    <SideSheet id="udpRecord-CreateMeetingSideSheet"
      title="Create a Meeting" onClose={handleClose} open={open} width={"800px"}
    >
      <CreateMeetingSeriesSideSheet createAction={handleCreateMeetingSeries} open={createSeriesOpen} onClose={() => { setCreateSeriesOpen(false) }} />
      <AmbientStepper activeStep={activeStep} steps={steps} />
      <Box sx={{ padding: "1em" }}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialValues={{ step: 0 }}
          validate={(values) => {
            const errors = {};
            let allFieldsValid = true;
            // Validate each field based on the defined validation functions
            Object.keys(validationSchema).forEach((fieldName) => {
              const fieldValidation = validationSchema[fieldName];
              const fieldValue = values[fieldName];
              const error = fieldValidation(fieldValue);
              if (error) {
                errors[fieldName] = error;
                allFieldsValid = false;
              }
            });
            setIsSecondFormValid(allFieldsValid);
            return errors;
          }}
        >
          {formSections[activeStep]}
          <Box mt={2} sx={{ alignItems: 'center' }}>
            {activeStep !== 0 && (
              <FluentButton id="udpRecord-CreateMeetingSideSheet-Back" udprecordid="udpRecord-CreateMeetingSideSheet-Back"
                variant="outlined" color="primary" onClick={handleBack}>Back</FluentButton>
            )}
            {activeStep !== steps.length - 1 && (
              <FluentButton id="udpRecord-CreateMeetingSideSheet-Next" udprecordid="udpRecord-CreateMeetingSideSheet-Next"
                variant="outlined" color="primary" onClick={handleNext} disabled={(!isFirstFormValid && activeStep === 0) || !isSecondFormValid && activeStep ===1 }>Next</FluentButton>
            )}
            {activeStep === steps.length - 1 && (
              <FluentButton id="udpRecord-CreateMeetingSideSheet-Submit" udprecordid="udpRecord-CreateMeetingSideSheet-Submit"
                variant="outlined" color="primary" type="submit">Submit</FluentButton>
            )}
          </Box>
        </Form>
      </Box>
    </SideSheet >
  );
};

export default CreateMeetingSideSheet;
