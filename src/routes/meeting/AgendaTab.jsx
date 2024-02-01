import { EditIcon, DeleteIcon } from '@fluentui/react-icons';
import { Box } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
    ActionsRenderer,
    AmbientGridTemplate,
    FluentTextFieldAutoComplete,
    apiMutate,
    useAxiosGet,
    Form,
    SideSheet,
    useHandleAxiosSnackbar,
} from 'unity-fluent-library';

import useFetchAgenda from './Agenda/useFetchAgenda';
import AgendaOrderForm from './AgendaOrderForm';
const AgendaTab = ({
    meetingId,
    agendaSidesheetOpen,
    setAgendaSidesheetOpen,
    meetingSeriesId
}) => {
    const [agenda_categoriesToCreate, setAgenda_categoriesToCreate] = useState([]);
    const [agenda_categoriesToDelete, setAgenda_categoriesToDelete] = useState([]);
    const [agenda_categoriesToUpdate, setAgenda_categoriesToUpdate] = useState([]);
    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();
    const { agenda, loading, error, fetchAgenda } = useFetchAgenda(meetingId);
    const formRef = useRef(null);
    // const { agendaCategories, agendaCategoriesLoading, agendaCategoriesError, fetchAgendaCategories } = useFetchAgendaCategories(agenda?.id);

    const [{ data: agendaCategories }, fetchAgendaCategories] = useAxiosGet(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsMeeting_Agenda_Category/${agenda?.id}/nameView`,
        {},
        !!!agenda?.id
    );
    const displayedAgendaCategories = useMemo(() => {
        // Combine existing categories with the new ones to create
        const combinedCategories = [...(agendaCategories || []), ...(agenda_categoriesToCreate || [])];

        // Filter out categories that are in the agenda_categoriesToDelete array
        const filteredCategories = combinedCategories.filter(
            category => !agenda_categoriesToDelete.includes(category.category_id)
        );

        return filteredCategories;
    }, [agendaCategories, agenda_categoriesToCreate, agenda_categoriesToDelete]);



    const addToAgendaCategories = useCallback((category) => {
        const addedCategory = {
            title: category.category.title,
            length_in_minutes: category.Length.value,
            order_number: displayedAgendaCategories.length + 1,
            category_id: category.category.id,
        };

        const isAlreadyAdded = displayedAgendaCategories.some(
            (existingCategory) => existingCategory.category_id === addedCategory.category_id
        );

        if (!isAlreadyAdded) {
            setAgenda_categoriesToCreate((prev) => [...prev, addedCategory]);
        } else {
            // Handle the case where the category is already added
            // For instance, show a notification or alert to the user
            handleErrorSnackbar("", "Category already added to agenda");
        }

    }, [displayedAgendaCategories]);

    const removeFromAgendaCategories = useCallback((category) => {
        // Check if the category is in agenda_categoriesToCreate
        const isInToCreate = agenda_categoriesToCreate.some(
            addedCategory => addedCategory.category_id === category.category_id
        );

        if (isInToCreate) {
            // Remove the category from agenda_categoriesToCreate
            setAgenda_categoriesToCreate(prev =>
                prev.filter(addedCategory => addedCategory.category_id !== category.category_id)
            );
        } else {
            // If not in agenda_categoriesToCreate but in agendaCategories, add to agenda_categoriesToDelete
            const isInAgendaCategories = agendaCategories.some(
                existingCategory => existingCategory.category_id === category.category_id
            );

            if (isInAgendaCategories) {
                setAgenda_categoriesToDelete((prev) => [...prev, category.category_id]);
            }
        }
    }, [agendaCategories, agenda_categoriesToCreate]);

    const onRowDragEnd = (e) => {
        const newOrderedCategories = e.node.parent.allLeafChildren.map((node, index) => {
            node.data.order_number = index + 1;
            return node.data;
        });

        // Update the order in agenda_categoriesToCreate based on newOrderedCategories
        const updatedToCreate = agenda_categoriesToCreate.map(cat => {
            const found = newOrderedCategories.find(newCat => newCat.category_id === cat.category_id);
            if (found) {
                cat.order_number = found.order_number;
            }
            return cat;
        });

        // Update the order and add to agenda_categoriesToUpdate based on newOrderedCategories
        // But only for those not already in agenda_categoriesToCreate
        let updatedToUpdate = [...agenda_categoriesToUpdate];
        newOrderedCategories.forEach(newCat => {
            if (!updatedToCreate.some(cat => cat.category_id === newCat.category_id)) {
                // Find the category in updatedToUpdate to update the order or add it if it doesn't exist
                const indexInToUpdate = updatedToUpdate.findIndex(cat => cat.category_id === newCat.category_id);
                if (indexInToUpdate > -1) {
                    updatedToUpdate[indexInToUpdate].order_number = newCat.order_number;
                } else {
                    updatedToUpdate.push(newCat);
                }
            }
        });

        setAgenda_categoriesToCreate(updatedToCreate);
        setAgenda_categoriesToUpdate(updatedToUpdate);

    }


    const handleUpdateAgenda = useCallback(async () => {
        try {
            const data = {
                agenda_categoriesToCreate,
                agenda_categoriesToDelete,
                agenda_categoriesToUpdate
            }
            const response = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                `cpsMeeting_Agenda/${agenda.id}/updateCategories`,
                {
                    data: {
                        agenda_categoriesToCreate,
                        agenda_categoriesToDelete,
                        agenda_categoriesToUpdate
                    },
                    method: "POST"
                }
            );
            setAgendaSidesheetOpen(false);
            fetchAgendaCategories();
            handleSuccessSnackbar("Agenda updated successfully");
            setAgenda_categoriesToCreate([])
            setAgenda_categoriesToDelete([])
            setAgenda_categoriesToUpdate([])
        } catch (error) {
            handleErrorSnackbar("", "Error updating agenda");
        }
    }, [agenda_categoriesToCreate, agenda_categoriesToDelete, agenda_categoriesToUpdate]);


    const onClose = () => {
        setAgendaSidesheetOpen(false);
        setAgenda_categoriesToCreate([]);
        setAgenda_categoriesToDelete([]);
    };

    const gridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
        },
        columnDefs: [
            { headerName: 'Category', field: 'title', },
            {
                headerName: 'Length', field: 'length_in_minutes',
                valueGetter: (params) => {
                    return params.data.length_in_minutes + " minutes"
                }
            },
            { headerName: "Order Number", field: "order_number" },
            // {
            //     headerName: 'Actions',
            //     cellRenderer: 'actionsRenderer',
            //     cellRendererParams: {
            //         actionList,
            //     },
            //     suppressMenu: true,

            // },
        ],
    };

    return (
        <>
            <AmbientGridTemplate
                title='Agenda'
                gridOptions={gridOptions}
                data={agendaCategories}
                useNewHeader
                frameworkComponents={{ actionsRenderer: ActionsRenderer }}
            />
            <Form
                onSubmit={() => console.log("submit")}
                ref={formRef}

            >
                <SideSheet
                    width="700px"
                    open={agendaSidesheetOpen}
                    title="Update Agenda"
                    onClose={onClose}
                    buttonLabel="Update Agenda"
                    onSubmit={() => handleUpdateAgenda()}
                >
                    <AgendaOrderForm
                        formRef={formRef}
                        onRowDragEnd={onRowDragEnd}
                        removeFromAgendaCategories={removeFromAgendaCategories}
                        addToAgendaCategories={addToAgendaCategories}
                        agenda_categories={displayedAgendaCategories}
                        meetingSeriesId={meetingSeriesId}
                        agenda_categoriesToCreate={agenda_categoriesToCreate}
                    />
                </SideSheet>
            </Form>
        </>
    );
};

export default AgendaTab;

