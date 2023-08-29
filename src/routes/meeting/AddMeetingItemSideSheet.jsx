import React, { useRef, useState, useEffect } from 'react';
import {
  Field,
  Form,
  SideSheet,
  FluentTextFieldAutoComplete,
  FluentDatePicker,
  FormButtons,
  SubmitButton,
  apiMutate,
  FluentButton,
} from 'unity-fluent-library';
import {
  TextField,
  Box,
  Chip,
} from '@material-ui/core';
import { Stack } from '@mui/material';


const AddMeetingItemSideSheet = ({ open, onClose, }) => {
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [createdBy, setCreatedBy] = useState('N/A');
  const [createdOn, setCreatedOn] = useState('N/A');
  const [updatedBy, setUpdatedBy] = useState('N/A');
  const [updatedOn, setUpdatedOn] = useState('N/A');

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
        user.name = user.first_name + " " + user.last_name;
      }
      setUsers([...users])
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [open])

  const handleSubmit = values => {
    console.log(values);
    onClose();
  };

  return (
    <SideSheet
      title="Add Meeting Item"
      open={open}
      onClose={onClose}
      width={'600px'}
    >
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`Created By: ${createdBy}`}
              size="small"
              color="primary"
              style={{ display: (createdBy == 'N/A') ? 'none' : 'block' }}
            />
            <Chip
              label={`Created On: ${createdOn}`}
              size="small"
              color="primary"
              style={{ display: (createdOn == 'N/A') ? 'none' : 'block' }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`Updated By: r${updatedBy}`}
              size="small"
              color="secondary"
              style={{ display: (updatedBy == 'N/A') ? 'none' : 'block' }}
            />
            <Chip
              label={`Updated On: ${updatedOn}`}
              size="small"
              color="secondary"
              style={{ display: (updatedOn == 'N/A') ? 'none' : 'block' }}
            />
          </Stack>
        </Stack>
        <Field
          component={FluentTextFieldAutoComplete}
          label="Category"
          id="Category"
          name="category"
          fullWidth
          variant="outlined"
          required
          options={['Category 1', 'Category 2', 'Category 3']}
          style={{ marginTop: '1.25rem', marginBottom: '1rem' }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <FluentButton
            variant="outlined"
            color="primary"
            style={{ width: '220px' }}
          >
            Create A New Category
          </FluentButton>
          <FluentButton
            variant="outlined"
            color="primary"
            style={{ width: '220px' }}
          >
            Manage Existing Categories
          </FluentButton>
        </Box>
        <Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'column', gap: '1rem' }}>
          <Field
            component={FluentDatePicker}
            label="Action Date"
            id="Action Date"
            name="action_date"
            variant="outlined"
          />
          <Field
            component={FluentDatePicker}
            label="Due Date"
            id="Due Date"
            name="due_date"
          />
        </Box>
        <Box sx={{ display: 'flex', direction: 'column', gap: '1rem', justifyContent: 'center' }}>
          <Field
            component={FluentTextFieldAutoComplete}
            label="Status"
            id="Status"
            name="status"
            margin="normal"
            options={['Open', 'Closed', 'Info']}
            style={{ width: '275px' }}
          />
          <Field
            component={FluentTextFieldAutoComplete}
            label="Priority"
            id="Priority"
            name="priority"
            options={['None', 'Low', 'Medium', 'High', 'Critical']}
            style={{ width: '275px' }}
          />
        </Box>
        <Field
          component={TextField}
          label="Subject"
          id="Subject"
          name="subject"
          variant="outlined"
          size="small"
        />
        <Field
          component={TextField}
          minRows={3}
          maxRows={4}
          multiline
          label="Description"
          id="Description"
          name="description"
          variant="outlined"
          required
        />
        <Field
          component={FluentTextFieldAutoComplete}
          label="Owner"
          id="Owner"
          name="owner"
          options={users}
          optionKey="name"
        />
        <Field
          component={TextField}
          minRows={3}
          maxRows={4}
          multiline
          label="Action Taken"
          id="Action Taken"
          name="action_taken"
          variant="outlined"
        />
        <FormButtons>
          <SubmitButton
            variant="contained"
            color="primary"
          >
            Add Meeting Item
          </SubmitButton>
        </FormButtons>
      </Form>
    </SideSheet>
  );
};

export default AddMeetingItemSideSheet;