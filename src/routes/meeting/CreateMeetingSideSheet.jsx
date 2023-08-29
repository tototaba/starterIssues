import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SideSheet,
  // FluentTextFieldAutoComplete,
  Form,
  Field,
  SubmitButton,
  FluentDatePicker,
  FluentTimePicker,
  TimeField,
  FluentTextField,
  FluentSelectMenu,
  FormButtons,
  FluentTextFieldAutoComplete,
  apiMutate,
  useHandleAxiosSnackbar,
  AmbientStepper,
  FluentButton,
} from "unity-fluent-library"
import {
  Box,
  Button,
  TextField,
} from '@material-ui/core';
import CreateMeetingSeriesModal from '../meetingSeries/CreateMeetingSeriesModal';
const CreateMeetingSideSheet = ({ open, onClose }) => {
  const formRef = useRef(null);
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const [users, setUsers] = useState([]);
  const [selectedMeetingSeries, setSelectedMeetingSeries] = useState(null);
  const [series, setSeries] = useState([]);
  const steps = ['Select or Create a Meeting Series', 'Create Meeting']; // Define your steps
  const [activeStep, setActiveStep] = useState(0); // State to track active step
  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const fetchSeries = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "CpsMeeting_group",
        {
          method: "GET"
        });
      const series = response.data;

      setSeries([...series])
    } catch (error) {
      handleErrorSnackbar("Could Not Fetch Meeting Series.")
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "cpsuser",
        {
          method: "GET"
        });
      const users = response.data;
      for (let user of users) {
        user.fullName = user.first_name + " " + user.last_name;
      }

      setUsers([...users])
    } catch (error) {
      handleErrorSnackbar("Could Not Fetch Users.")
    }
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

  const saveMeetingWithAttendees = async (values) => {
    const meeting = {
      Group_id: values.MeetingSeries.id,
      // Group_id: selectedMeetingSeries.id,
      Meeting_number: values.MeetingNumber,
      Title: values.Title,
      Status: "Active",
      Location: values.Location,
      Date: values.date,
      // Start_time: values.startTime.getTime(),
      // End_time: values.endTime.getTime(),
    }
    const meetingAttendees = values.users.map((user) => mapUserToAttendee(user, values.MeetingNumber, values.MeetingSeries.id));
    const data = {
      data: {
        cpsMeeting: meeting,
        cpsMeeting_attendees: meetingAttendees
      },
      method: "POST"
    }
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "cpsmeeting/withAttendees",
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  function mapUserToAttendee(user, meetingNumber, meetingSeriesId) {
    const attendee = {
      group_id: meetingSeriesId,
      // group_id: selectedMeetingSeries.id, // Assuming company_id corresponds to group_id
      user_id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      company: null, // You can update this if needed
      meeting_number: meetingNumber, // You can update this if needed
      is_guest: 0, // Default to 0 for user
    };
    return attendee;
  }

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setSelectedMeetingSeries(values.MeetingSeries);
      const response = await saveMeetingWithAttendees(values);
      const meetingName = response.data.createdMeetingAttendeeMeetingRecords.Title;
      handleSuccessSnackbar(`Successfully Created Meeting`)
      // ${meetingName}
      onClose();
    } catch (error) {
      handleErrorSnackbar("Could Not Create Meeting.")
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
      },
      method: "POST"
    }
    try {
      const response = await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        "CpsMeeting_group",
        data

      );
      const createdSeries = response.data;
      fetchSeries();
      handleSuccessSnackbar(`Successfully Created Meeting Series`)
      // ${createdSeries.name}
      setSelectedMeetingSeries(createdSeries);
      setCreateSeriesOpen(false);
    } catch (error) {
      handleErrorSnackbar("Could Not Create Meeting Series.")
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSeries();
  }, [open]);


  const handleClose = () => {
    onClose();
    setActiveStep(0);
    setSelectedMeetingSeries(null);
  };

  const formSections = [
    // Step 1
    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Field
        component={FluentTextFieldAutoComplete}
        label="Meeting Series"
        id="MeetingSeries"
        name="MeetingSeries"
        variant="outlined"
        margin="none"
        size="large"
        fullWidth
        options={series}
        optionKey={'name'}
        required
        // initialValue={selectedMeetingSeries?.name || ""}
        style={{ width: "379px" }}
      />
      <p>OR</p>
      <Box sx={{ padding: "1rem" }}>
        <Button variant="contained" onClick={() => { setCreateSeriesOpen(true) }}>
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
          initialValue={selectedMeetingSeries?.cpsMeeting_groupCpsMeeting?.length + 1 || 1}
        />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: "1rem", alignItems: "center" }} >

        <Field
          component={TextField}
          label="Location"
          id="Location"
          name="Location"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
          initialValue={getInitialLocation()}
        />
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
          component={FluentTimePicker}
          id="startTime"
          name="startTime"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
        // initialValue={}
        />
        <Field
          label={"End Time"}
          component={FluentTimePicker}
          id="endTime"
          name="endTime"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
        // initialValue={}
        />
      </Box >
      <Box>
        <Field
          label={"Attendees"}
          component={FluentTextFieldAutoComplete}
          id="users"
          name="users"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          isMultiple
          options={users}
          optionKey={'fullName'}
          required
        // initialValue={ }
        />
      </Box>

    </Box>,
  ];
  return (
    <SideSheet title="Create a Meeting Series" onClose={handleClose} open={open} width={"700px"}>
      <CreateMeetingSeriesModal createAction={handleCreateMeetingSeries} open={createSeriesOpen} onClose={() => { setCreateSeriesOpen(false) }} />
      <AmbientStepper activeStep={activeStep} steps={steps} />
      <Box sx={{ padding: "3em" }}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialValues={{ step: 0 }} // Initialize form with step 0
        >
          {/* Display the current form section based on active step */}
          {formSections[activeStep]}
          {/* Place the AmbientStepper component after the form section */}
          {/* Add buttons for navigating between steps */}
          <Box mt={2} sx={{ alignItems: 'center' }}>
            {activeStep !== 0 && (
              <FluentButton variant="outlined" color="primary" onClick={handleBack}>Back</FluentButton>
            )}
            {activeStep !== steps.length - 1 && (
              <FluentButton variant="outlined" color="primary" onClick={handleNext}>Next</FluentButton>
            )}
            {activeStep === steps.length - 1 && (
              <FluentButton variant="outlined" color="primary" type="submit">Submit</FluentButton>
            )}
          </Box>
        </Form>
      </Box>
    </SideSheet >
  );
};

export default CreateMeetingSideSheet;
