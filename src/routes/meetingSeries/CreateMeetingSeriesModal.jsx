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
import { HintPanel } from '../../utils/HintPanel';
import { create } from 'lodash';
// import MeetingItemFormPropertyTable from './MeeingItemFormPropertyTable';
const CreateMeetingSeriesModal = ({ open, onClose, createAction }) => {
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
      console.log(error);
    }

  }

  useEffect(() => {
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
      actionOne={() => { createAction(formRef.current.values) }}
    >
      <Form ref={formRef} onSubmit={createAction}>
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

export default CreateMeetingSeriesModal;
