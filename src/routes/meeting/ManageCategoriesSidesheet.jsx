import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    SideSheet,
    useHandleAxiosSnackbar,
    FluentButton,
} from "unity-fluent-library"
import CategoriesGrid from './CategoriesGrid';
import CategorySideSheet from './CategorySideSheet';

const ManageCategoriesSidesheet = ({ open, onClose, refetchCategories, categories, handleCategoryCreate }) => {
    // selectedMeetingSeries = { id: 31, name: "Series 1", cpsMeeting_groupCpsMeeting: [0, 1, 0, { location: "Univerus Head Office" }] }

    const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);

    // const formRef = useRef(null);
    
    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();
    return (
        <SideSheet
            title="Manage Categories"
            onClose={onClose}
            open={open}
            width={"500px"}
        >
            <FluentButton
                variant="outlined"
                color="primary"
                style={{ width: '220px' }}
                onClick={() => setCreateCategoryOpen(true)}
            >
                Create A New Category
            </FluentButton>
            
            <CategorySideSheet
                action={handleCategoryCreate}
                open={CreateCategoryOpen}
                onClose={() => {
                    setCreateCategoryOpen(false);
                }}
            ></CategorySideSheet>
            
            <CategoriesGrid categories={categories} refetchCategories={refetchCategories}></CategoriesGrid>

        </SideSheet >
    );
};

export default ManageCategoriesSidesheet;