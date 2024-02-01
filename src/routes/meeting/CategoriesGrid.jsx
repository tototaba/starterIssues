import { EditIcon, DeleteIcon } from '@fluentui/react-icons';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AmbientGridTemplate, FluentCheckbox, AgTable, ActionsRenderer, useAxiosGet, apiMutate, useHandleAxiosSnackbar } from 'unity-fluent-library';
import CategorySideSheet from './CategorySideSheet';
import ModalAlert from '../../UI/ModalAlert';
import { Category } from '@mui/icons-material';
import { get } from 'lodash';
const CategoriesGrid = props => {
    const {
        categories,
        refetchCategories
    } = props;
    const [categoriesWithItems, setCategoriesWithItems] = useState([]);
    const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
    const [modalOpen, setModalOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const searchData = {
                data: {
                    "pageNumber": 1,
                    "pageSize": 20,
                    "filterElements": [],
                    "orderElements": [
                        {
                            "sortColumn": "Category_Id",
                            "sortDirection": "ASC"
                        }
                    ],
                    "groupingType": "DISTINCT",
                    "groupProperty": [
                        "Category_Id"
                    ],
                    "groupOperationList": [],
                    "eagerLoad": false,
                    "logicalSearchOperator": 1
                },
                method: "POST"
            };

            const result = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                `cpsmeeting_item/search`,
                searchData
            );
            let categories = result.data.pageList.map((item) => item.category_id)
            setCategoriesWithItems(categories)
            setLoading(false);
        }
        fetchCategories();
    }, []);
    const handleEdit = (item) => {
        setModalOpen(true);
        setCategory(item);
    }

    const handleEditSubmit = useCallback(async (item) => {
        try {
            const updatedCategory = { ...category }
            updatedCategory.title = item.Title;
            const data = {
                data: { ...updatedCategory },
                method: "PUT"
            }

            const response = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                `cpsCategory/${category.id}`,
                data
            );

            handleSuccessSnackbar("Category updated successfully");
            refetchCategories();
            setModalOpen(false);
        } catch (error) {
            handleErrorSnackbar(error, "Error updating category");
        }
    }, [category]);

    const handleDeleteSubmit = useCallback(async () => {
        const categoryId = category.id
        try {
            const response = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                `cpsCategory/${categoryId}`,
                {
                    method: "DELETE"
                }
            );

            handleSuccessSnackbar("Category deleted successfully");
            refetchCategories();
            setDeleteModalOpen(false);
        } catch (error) {
            handleErrorSnackbar(error, "Error deleting category");
        }
    }, [category]);

    const handleDelete = (row) => {
        setCategory(row);
        setDeleteModalOpen(true);
    }

    const getDisabled = useCallback(
        (row) => {
            return categoriesWithItems.includes(row.id);
        },
        [categoriesWithItems]
    );

    const getTitle = useCallback(
        (row) => {
            if (getDisabled(row)) {
                return "Cannot Delete Category with Items";
            }
            return "Delete";
        },
        [categoriesWithItems]
    );

    const getActionsList = useCallback((params) => {
        const actionList = [
            {
                id: 1,
                title: 'Edit',
                icon: EditIcon,
                onClick: handleEdit,
                disabled: false,
            },
            {
                id: 2,
                title: getTitle(params.data),
                icon: DeleteIcon,
                onClick: handleDelete,
                disabled: getDisabled(params.data),
            },
        ];

        return {
            actionList,
        };
    }, [handleEdit, handleDelete, getTitle, getDisabled]);


    const gridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
        },
        columnDefs: [
            {
                headerName: 'Name',
                field: 'title',
                width: 100,
            },
            {
                headerName: 'Actions',
                cellRenderer: 'actionsRenderer',
                cellRendererParams: (params) => getActionsList(params),
                width: 30,
                suppressMenu: true,
            },
        ],
    };

    return (
        <>
            {(loading) ? <div>Loading...</div> :
                <AmbientGridTemplate
                    gridOptions={gridOptions}
                    data={categories}
                    useNewHeader
                    frameworkComponents={{ actionsRenderer: ActionsRenderer }}
                />
            }
            <CategorySideSheet selectedCategory={category} action={handleEditSubmit} isEdit={true} open={modalOpen} onClose={() => { setModalOpen(false) }}> </CategorySideSheet>
            <ModalAlert
                title={`Delete ${category ? category.title : ''}`}
                message='Are you sure you want to delete this category?'
                closeAlert={() => setDeleteModalOpen(false)}
                open={deleteModalOpen}
                action={handleDeleteSubmit}
            />
        </>
    );
};
export default CategoriesGrid;
