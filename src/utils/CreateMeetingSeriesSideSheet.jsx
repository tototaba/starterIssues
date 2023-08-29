import React, { useState, useRef, useEffect } from 'react';
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
  FluentDialog,
} from "unity-fluent-library"
import {
  Box,
  Button,
  TextField,
  responsiveFontSizes
} from '@material-ui/core';
import { HintPanel } from './HintPanel';
import MeetingItemFormPropertyTable from './MeeingItemFormPropertyTable';
const CreateMeetingSeriesSideSheet = ({ open, onClose, }) => {
  // TODO need to get the meeting number and pass it in
  // TODO need to pass in the current meeting series
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (values) => {
    const data = {
      data: {
        Group_id: 31,
        Meeting_number: values.MeetingNumber,
        Title: values.Title,
        Status: "Active",
        Location: values.Location,
        Date: values.date,
        // Start_time: values.startTime.getTime(),
        // End_time: values.endTime.getTime(),
      },
      method: "POST"
    }
    console.log("🚀 ~ file: CreateMeetingSeriesSideSheet.jsx:55 ~ handleSubmit ~ data:", data.data)


    // try {
    //   const response = await apiMutate(
    //     procss.env.REACT_APP_PRODUCTIVITY_API_BASE,
    //     "cpsmeeting",
    //     data
    //   );
    // } catch (error) {
    //   console.log(error);
    // }

  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiMutate(
          procss.env.REACT_APP_PRODUCTIVITY_API_BASE,
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
        console.log(error);
      }

    }
    fetchUsers();
  }, [open])

  return (
    <FluentDialog
      onClose={onClose}
      width={"600px"}
      title="Create a New Meeting Series"
      open={open}
      labelOne="Create"
      labelTwo="Cancel"
    // actionOne={ }
    >
      <Form ref={formRef} onSubmit={handleSubmit}>
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
        {/* <MeetingItemFormPropertyTable /> */}

      </Form>
    </FluentDialog >
  );
};

export default CreateMeetingSeriesSideSheet;
