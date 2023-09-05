import React, { useState, useRef } from 'react';
import {
  Button,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
} from "unity-fluent-library"
import { HintPanel } from './HintPanel';
import { Box } from '@material-ui/core';
import { FluentTextFieldAutoComplete } from './FluentTextAutoComplete';

const CreateMeetingSideSheet = ({ isOpen, onClose }) => {

  const formRef = useRef(null);
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <SideSheet width={"600px"} title="Create a New Meeting" open={true} onClose={onClose}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Box >
          <Box>
            <HintPanel hint={"Meetings can only exist within a Meeting Series. To continue you must select a current Meeting Series or create a new Meeting Series."}></HintPanel>

          </Box>
          <Field
            component={FluentTextFieldAutoComplete}
            label="Meeting Series"
            id="alias"
            name="alias"
            variant="outlined"
            margin="none"
            size="large"
            fullWidth
            isMultiple
            limitTags={2}
            options={[{ label: "test" }, { label: "tset" }, { label: "fest" },]}
            optionKey={'label'}
            required
          // initialValue={column.alias || camelToPascalCaseWithSpace(column?.name)}
          />
        </Box>
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
          />
        </Box>
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
        />

        <Field
          label={"Date"}
          component={FluentDatePicker}
          id="date"
          name="date"
          variant="outlined"
          margin="normal"
          size="small"
        // initialValue={}
        />
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
          // initialValue={}
          />
        </Box>
        <Field
          label={"Users"}
          component={FluentTextFieldAutoComplete}
          id="users"
          name="users"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          isMultiple
          options={[{ label: "test" }, { label: "tset" }, { label: "fest" },]}
          optionKey={'label'}
          required
        // initialValue={ }
        />
        <FormButtons>
          <SubmitButton>Create</SubmitButton>
        </FormButtons>
      </Form>
    </SideSheet >
  );
};

export default CreateMeetingSideSheet;
