// CreateMeetingAgendaStep.jsx
import React, { useCallback, useState, useEffect } from 'react';
import {
    ActionsRenderer,
    AgTable,
    FluentButton,
    FluentCard,
    FluentTextFieldAutoComplete,
    useAxiosGet,
    Field,
    useHandleAxiosSnackbar
} from "unity-fluent-library";
import { Box } from '@material-ui/core';
import { CreateCategory } from './Categories/categoriesHelpers';
import { AddIcon, SettingsIcon, EditIcon, DeleteIcon } from '@fluentui/react-icons';
import ManageCategoriesSidesheet from './ManageCategoriesSidesheet';
import CategorySideSheet from './CategorySideSheet';

const AgendaOrderForm = ({
    gridApi,
    formRef,
    agenda_categories,
    meetingSeriesId,
    addToAgendaCategories,
    removeFromAgendaCategories,
    onRowDragEnd,
    agenda_categoriesToCreate
}) => {
    const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
    const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();


    const [{ data: categories }, refetchCategories] = useAxiosGet(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `CpsCategory/${meetingSeriesId}/group`,
        {},
    );
    const handleCategoryCreateClick = async (category) => {
        try {
            const createdCategory = await CreateCategory(category, meetingSeriesId)
            setSelectedCategory(createdCategory.data);
            refetchCategories();
            handleSuccessSnackbar("Category created successfully");
        } catch (error) {
            handleErrorSnackbar("Could not create category");
        }
    }

    const actionList = [
        {
            id: 1,
            title: 'Edit',
            icon: EditIcon,
            disabled: false
        },
        {
            id: 2,
            title: 'Delete',
            icon: DeleteIcon,
            onClick: removeFromAgendaCategories,
            disabled: false
        }
    ];

    const gridOptions = {
        columnDefs: [
            {
                headerName: 'Category', field: 'title', rowDrag: true, width: 340,
            },
            {
                headerName: 'Length', field: 'length_in_minutes',
                valueGetter: (params) => {
                    return params.data.length_in_minutes + " minutes"
                }
            },
            {
                headerName: 'Actions',
                cellRenderer: 'actionsRenderer',
                cellRendererParams: {
                    actionList,
                },
                suppressMenu: true,
            },
        ],
        onRowDragEnd: onRowDragEnd,
    };
    return (
        <Box>
            <FluentCard style={{ padding: "1em" }}>
                <Field
                    component={FluentTextFieldAutoComplete}
                    label="Category"
                    id="category"
                    name="category"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                    optionKey="title"
                    options={categories}
                    initialValue={selectedCategory || null}
                />
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                    <FluentButton onClick={() => { setManageCategoriesOpen(true) }}>
                        <span style={{ marginRight: "10px" }}>Manage</span>
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
            </FluentCard>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <FluentButton onClick={() => addToAgendaCategories(formRef.current.values)}>
                    <span style={{ marginRight: "10px" }}>add</span>
                    <AddIcon></AddIcon>
                </FluentButton>
            </Box>
            <ManageCategoriesSidesheet
                categories={categories}
                refetchCategories={refetchCategories}
                open={ManageCategoriesOpen}
                onClose={() => {
                    setManageCategoriesOpen(false);
                }}
            ></ManageCategoriesSidesheet>
            <CategorySideSheet
                action={(category) => handleCategoryCreateClick(category)}
                open={CreateCategoryOpen}
                onClose={() => {
                    setCreateCategoryOpen(false);
                }}
            ></CategorySideSheet>
            <AgTable
                title='Agenda'
                gridOptions={gridOptions}
                rowData={agenda_categories}
                height={"500px"}
                frameworkComponents={{ actionsRenderer: ActionsRenderer }}
                rowDragManaged={true}
                api={gridApi}
            />
        </Box>
    );
};

export default AgendaOrderForm;
