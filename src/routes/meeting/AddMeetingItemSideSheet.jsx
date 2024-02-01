import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
  useHandleAxiosSnackbar,
  useUser,
  useAxiosGet,
  useAxiosMutate,
} from 'unity-fluent-library';
import {
  TextField,
  Box,
  Chip,
} from '@material-ui/core';
import { Stack } from '@mui/material';
import CategoryManager from './CategoryManager';
import { formatDate } from "../../utils/formatDateHelpers";
import Meeting from './Meeting';


const AddMeetingItemSideSheet = ({ open, onClose, meetingId, meetingSeriesId, refetchMeetingItems, selectedMeetingItem, isEdit, handleCategoryCreate, refetchCategories, categories, meeting, meetingDate }) => {
  const formRef = useRef(null);
  const user = useUser();
  const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();

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
          searchField: "group_id",
          searchValue: meetingSeriesId,
          searchOperator: "=",
        },
      ],
    },
    method: "POST",
  }), [meetingSeriesId]);

  const [
    {
      data: meeting_attendees,
      loading: loading,
      error: error,
    },
    fetchMeetingAttendees,
  ] = useAxiosMutate(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    "cpsMeeting_attendee/search",
    searchData
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendeesData = await fetchMeetingAttendees();
      } catch (error) {
        console.error('Error fetching meeting attendees:', error);
      }
    };
    fetchData();
  }, [fetchMeetingAttendees]);

  const meetingAttendeesFirstName = useMemo(() => {
    if (!meeting_attendees) return [];
    return meeting_attendees.pageList?.map((attendee) => {
      return {
        ...attendee,
        name: attendee?.first_name + " " + attendee?.last_name,
      };
    });
  }, [meeting_attendees]);

  function convertUTCToDateString(utcTimestamp) {
    const date = new Date(utcTimestamp);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Months are zero-based, so add 1
    const day = date.getUTCDate();

    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }

  async function handleMeetingItemWithAttendeesAction(meeting_item_action_attendee, actionType) {
    const actionPaths = {
      create: "CpsMeeting_item/createCpsMeetingItem",
      update: "CpsMeeting_item/updateCpsMeetingItem"
    };

    const actionMessages = {
      create: {
        success: "Successfully added Meeting Item",
        error: "Error adding Meeting Item"
      },
      update: {
        success: "Successfully updated Meeting Item",
        error: "Error updating Meeting Item"
      }
    };

    const path = actionPaths[actionType];
    const messages = actionMessages[actionType];

    if (!path || !messages) {
      handleErrorSnackbar("", "Error adding Meeting Item")
      return;
    }

    try {
      const data = {
        data: meeting_item_action_attendee,
        method: isEdit ? "PUT" : "POST"
      }

      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        path,
        data
      );

      refetchMeetingItems();
      handleSuccessSnackbar(messages.success);
    } catch (error) {
      handleErrorSnackbar("", messages.error);
    }
  }

  const handleSubmit = values => {
    var date = convertUTCToDateString(Date.now());

    const meeting_item =
    {
      Id: isEdit ? selectedMeetingItem?.item_id : 0,
      group_id: meetingSeriesId,
      meeting_created: isEdit ? selectedMeetingItem?.meeting_created : meeting.meeting_number,
      meeting_created_id: isEdit ? selectedMeetingItem?.meeting_created_id : meetingId,
      open_date: date,
      due_date: values.due_date,
      is_persistant: 0,
      is_section: 0,
      created_by: isEdit ? selectedMeetingItem?.created_by : user?.name,
      created_on: date,
      updated_by: isEdit ? user?.name : null,
      subject: values.subject,
      priority: values.priority,
      description: values.description,
      status: values.status,
      category_id: values.category?.id,
      item_number: isEdit ? selectedMeetingItem?.item_number : null,
    }

    const meeting_item_action =
    {
      meeting_id: meetingId,
      action_taken: values.action_taken,
      action_date: values.action_date,
    }

    const meeting_attendee =
    {
      id: values.owner?.id, //attendee+id
      group_id: meetingSeriesId,
      meeting_number: meetingId
    }

    const meeting_item_action_attendee = {
      meeting_item: meeting_item,
      meeting_item_action: meeting_item_action,
      meeting_attendee: meeting_attendee,
      cpsMeeting_Id: meetingId,
      cpsCategory_Id: meeting_item.category_id
    }

    if (!isEdit) {
      handleMeetingItemWithAttendeesAction(meeting_item_action_attendee, 'create');
    } else {
      handleMeetingItemWithAttendeesAction(meeting_item_action_attendee, 'update');
    }
    onClose();
  };

  const getDate = (inputString) => {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
    if (!dateRegex.test(inputString)) {
      return "Invalid Date Format";
    }

    // Parse the input string into a Date object
    const [year, month, day] = inputString.split('T')[0].split('-');
    const formattedDate = new Date(`${month}/${day}/${year}`);

    // Check if the Date object is valid
    if (!(formattedDate instanceof Date) || isNaN(formattedDate)) {
      return "Invalid Date";
    }

    const formattedMonth = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(formattedDate.getDate()).padStart(2, '0');
    const formattedYear = String(formattedDate.getFullYear());

    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  };

  const getMeetingItemActionForMeeting = (isGetDate) => {
    const { actionItems } = selectedMeetingItem || {};

    if (!actionItems || actionItems.length === 0) return null;
    const action = actionItems.find(action => {
      return action.meeting_id == meetingId
    })
    if (!action) return null;
    return isGetDate ? action.action_date : action.action_taken;
  }

  const getOwner = () => {
    // match the owner to a meeting attendee by the attendee id
    const { attendee_id } = selectedMeetingItem || {};
    if (!attendee_id) return null;
    const owner = meetingAttendeesFirstName.find(attendee => {
      return attendee.id == attendee_id
    })
    return owner ? owner : null;
  }

  return (
    <SideSheet
      title={isEdit ? "Edit Meeting Item" : "Add Meeting Item"}
      open={open}
      onClose={onClose}
      width={'600px'}
    >
      <Form ref={formRef} onSubmit={handleSubmit}>
        {isEdit && (
          <Box>
            <Chip
              label={`Created By: ${selectedMeetingItem?.created_by}`}
              size="small"
              color="primary"
              style={{ display: selectedMeetingItem?.created_by === null || selectedMeetingItem?.created_by === "" ? 'none' : 'inline-block' }}
              variant="outlined"
            />
            <Chip
              label={`Created On: ${getDate(selectedMeetingItem?.created_on)}`}
              size="small"
              color="primary"
              style={{ display: !selectedMeetingItem?.created_on ? 'none' : 'inline-block' }}
              variant="outlined"
            />
            <Chip
              label={`Updated By: ${selectedMeetingItem?.created_by}`}
              size="small"
              color="primary"
              style={{ display: selectedMeetingItem?.created_by === null || selectedMeetingItem?.created_by === "" ? 'none' : 'inline-block' }}
              variant="outlined"
            />
            <Chip
              label={`Updated On: ${getDate(selectedMeetingItem?.created_on)}`}
              size="small"
              color="primary"
              style={{ display: !selectedMeetingItem?.updated_on ? 'none' : 'inline-block' }}
              variant="outlined"
            />
          </Box>
        )}

        <CategoryManager
          categories={categories}
          selectedMeetingItem={selectedMeetingItem}
          refetchCategories={refetchCategories}
          handleCategoryCreate={handleCategoryCreate}
        />
        <Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'column', gap: '1rem' }}>
          <Field
            component={FluentDatePicker}
            label="Action Date"
            id="Action Date"
            name="action_date"
            variant="outlined"
            initialValue={meetingDate}
            required
          />
          <Field
            component={FluentDatePicker}
            label="Due Date"
            id="Due Date"
            name="due_date"
            variant="outlined"
            // initialValue={selectedMeetingItem?.dueDate ? selectedMeetingItem.dueDate : null}
            initialValue={formatDate(selectedMeetingItem?.due_date)}
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
            initialValue={selectedMeetingItem?.status ? selectedMeetingItem.status : null}
          />
          <Field
            component={FluentTextFieldAutoComplete}
            label="Priority"
            id="Priority"
            name="priority"
            options={['None', 'Low', 'Medium', 'High', 'Critical']}
            style={{ width: '275px' }}
            initialValue={selectedMeetingItem?.priority ? selectedMeetingItem.priority : null}
          />
        </Box>
        <Field
          component={TextField}
          label="Subject"
          id="Subject"
          name="subject"
          variant="outlined"
          size="small"
          required
          initialValue={selectedMeetingItem?.subject ? selectedMeetingItem.subject : null}
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
          initialValue={selectedMeetingItem?.description ? selectedMeetingItem.description : null}
        />
        <Field
          component={FluentTextFieldAutoComplete}
          label="Owner"
          id="Owner"
          name="owner"
          options={meetingAttendeesFirstName}
          optionKey="name"
          initialValue={getOwner()}
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
          initialValue={getMeetingItemActionForMeeting(false)}
        />
        <FormButtons>
          <SubmitButton
            variant="contained"
            color="primary"
          >
            {isEdit ? "Update Meeting Item" : "Add Meeting item"}
          </SubmitButton>
        </FormButtons>
      </Form>
    </SideSheet >
  );
};

export default AddMeetingItemSideSheet;

