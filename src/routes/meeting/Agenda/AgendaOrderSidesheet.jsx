import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SettingsIcon, AddIcon, EditIcon, DeleteIcon } from '@fluentui/react-icons';
import {
    FluentTextFieldAutoComplete,
    SideSheet,
    useHandleAxiosSnackbar,
    Form,
    Field,
    FormButtons,
    SubmitButton,
    apiMutate,
    FluentButton,
    FluentCard,
    AgTable,
    ActionsRenderer,
    useAgGridApi
} from "unity-fluent-library"
import CategoriesGrid from '../CategoriesGrid';
import ManageCategoriesSidesheet from '../ManageCategoriesSidesheet';
import CategorySideSheet from '../CategorySideSheet';
import CategoryManager from '../CategoryManager';
import { IconButton } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { CreateCategory } from '../Categories/categoriesHelpers';
const AgendaSidesheet = ({
    agenda,
    open,
    onClose,
    meetingSeriesId,
    categories,
    fetchAgenda_categories,
    refetchCategories,
}) => {

    const formRef = useRef(null);
    const { gridApi, gridColumnApi, onGridReady } = useAgGridApi();
    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();
    const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
    const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);
    const [agenda_categoriesToCreate, setAgenda_categoriesToCreate] = useState([]);
    const [orderedCategories, setOrderedCategories] = useState([]);
    const onSubmit = (e) => {
        handleMeetingAgendaCategoryCreate(e)
        onClose();
    }

    const addToAgendaCategories = useCallback((formValues) => {
        const agendaCategory = {
            length: formValues.Length.value,
            category: formValues.category,
        }
        setAgenda_categoriesToCreate((prevAgendaCategories) => {
            const newAgendaCategories = [...prevAgendaCategories];
            newAgendaCategories.push(agendaCategory);
            return newAgendaCategories;
        });
    }, [setAgenda_categoriesToCreate]);

    const removeFromAgendaCategories = useCallback(() => {
        setAgenda_categoriesToCreate((prevAgendaCategories) => {
            const newAgendaCategories = [...prevAgendaCategories];
            newAgendaCategories.pop();
            return newAgendaCategories;
        });
    }, [setAgenda_categoriesToCreate]);
    function onRowDragEnd(e) {
        setOrderedCategories(e.node.parent.allLeafChildren.map((node) => node.data));
    }
    const actionList = useMemo(
        () => [
            {
                id: 1,
                title: 'Edit',
                icon: EditIcon,
                // onClick: handleEdit,
                disabled: false
            },
            {
                id: 2, // Giving it a unique id
                title: 'Delete',
                icon: DeleteIcon, // Assuming you have this icon
                onClick: removeFromAgendaCategories, // Assuming you have this function
                disabled: false
            }
        ],
        []
    );
    const gridOptions = {

        columnDefs: [
            {
                headerName: 'Category', field: 'title', rowDrag: true, width: 340,
                valueGetter: (params) => {
                    return params.data.category.title
                }
            },
            {
                headerName: 'Length', field: 'length_in_minutes',
                valueGetter: (params) => {
                    return params.data.length + " minutes"
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
        <SideSheet
            title="Update Agenda Order"
            onClose={onClose}
            open={open}
            width={"500px"}
            buttonLabel="Update Agenda"
        >
            <Form onSubmit={onSubmit}>

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
                            // required
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
                            // required
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
                        action={CreateCategory}
                        open={CreateCategoryOpen}
                        onClose={() => {
                            setCreateCategoryOpen(false);
                        }}
                    ></CategorySideSheet>
                    <AgTable
                        title='Agenda'
                        gridOptions={gridOptions}
                        rowData={agenda_categoriesToCreate}
                        height={"500px"}
                        frameworkComponents={{ actionsRenderer: ActionsRenderer }}
                        rowDragManaged={true}
                        api={gridApi}
                    // primaryActionButton={pab}
                    />
                </Box >
            </Form>
        </SideSheet >
    );
};

export default AgendaSidesheet;