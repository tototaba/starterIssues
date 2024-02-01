import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SettingsIcon, AddIcon } from '@fluentui/react-icons';
import {
    FluentTextFieldAutoComplete,
    SideSheet,
    useHandleAxiosSnackbar,
    Form,
    Field,
    FormButtons,
    SubmitButton,
    apiMutate,
    FluentButton
} from "unity-fluent-library"
import ManageCategoriesSidesheet from './ManageCategoriesSidesheet';
import CategorySideSheet from './CategorySideSheet';
import { Box } from '@material-ui/core';
const AgendaSidesheet = ({
    agenda,
    open,
    onClose,
    categories,
    handleCategoryCreate,
    isEdit,
    meetingId,
    meetingSeriesId,
    fetchAgenda_categories,
    refetchCategories,
}) => {
    const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
    const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);
    const formRef = useRef(null);
    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();

    const onSubmit = (e) => {
        handleMeetingAgendaCategoryCreate(e)
        onClose();
    }

    const handleMeetingAgendaCategoryCreate = useCallback(async (formValues) => {
        try {
            const agendaCategoryData = {
                data: {
                    agenda_id: agenda.id,
                    category_id: formValues.category.id,
                    length_in_minutes: formValues.Length.value
                },
                method: "POST"
            };

            const agendaCategoryResponse = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                `cpsMeeting_Agenda_Category/incrementOrderNumber`,
                agendaCategoryData
            );

            handleSuccessSnackbar("Meeting agenda category created successfully");
            fetchAgenda_categories();
        } catch (error) {
            handleErrorSnackbar("", "Error creating meeting agenda category");
        }
    }, [meetingSeriesId, agenda]);

    return (
        <SideSheet
            title="Add Agenda Item"
            onClose={onClose}
            open={open}
            width={"500px"}
        >
            <Form ref={formRef} onSubmit={onSubmit}>
                <Field
                    component={FluentTextFieldAutoComplete}
                    label="Category"
                    id="category"
                    name="category"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                    required
                    optionKey="title"
                    options={categories}
                />
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                    <FluentButton onClick={() => { setManageCategoriesOpen(true) }}>
                        <span style={{ marginRight: "10px" }}> Manage </span>
                        <SettingsIcon></SettingsIcon>
                    </FluentButton>
                    <FluentButton onClick={() => { setCreateCategoryOpen(true) }}>
                        <span style={{ marginRight: "10px" }}>Create</span>
                        <AddIcon></AddIcon>
                    </FluentButton>
                </Box>
                <Field
                    component={FluentTextFieldAutoComplete}
                    label="Length (minutes)"
                    id="Length"
                    name="Length"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                    required
                    optionKey="label"
                    options={[
                        { label: '5 minutes', value: 5 },
                        { label: '10 minutes', value: 10 },
                        { label: '15 minutes', value: 15 },
                        { label: '30 minutes', value: 30 },
                        { label: '45 minutes', value: 45 },
                        { label: '60 minutes', value: 60 },
                    ]}
                />

                <ManageCategoriesSidesheet
                    categories={categories}
                    refetchCategories={refetchCategories}
                    open={ManageCategoriesOpen}
                    onClose={() => {
                        setManageCategoriesOpen(false);
                    }}
                ></ManageCategoriesSidesheet>
                <CategorySideSheet
                    action={handleCategoryCreate}
                    open={CreateCategoryOpen}
                    onClose={() => {
                        setCreateCategoryOpen(false);
                    }}
                ></CategorySideSheet>
                <FormButtons>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                    >
                        {isEdit ? "Update Agenda Item" : "Add Agenda Item"}
                    </SubmitButton>
                </FormButtons>
            </Form>
        </SideSheet >
    );
};

export default AgendaSidesheet;