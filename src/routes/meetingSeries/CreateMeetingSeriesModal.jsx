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
  useAxiosGet,
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
  const formRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

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
