import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    SideSheet,
    useHandleAxiosSnackbar,
} from "unity-fluent-library"
import CategoriesGrid from './CategoriesGrid';
const ManageCategoriesSidesheet = ({ open, onClose, refetchCategories, categories }) => {
    // selectedMeetingSeries = { id: 31, name: "Series 1", cpsMeeting_groupCpsMeeting: [0, 1, 0, { location: "Univerus Head Office" }] }
    const formRef = useRef(null);
    const { handleErrorSnackbar, handleSuccessSnackbar } =
        useHandleAxiosSnackbar();
    return (
        <SideSheet
            title="Manage Categories"
            onClose={onClose}
            open={open}
            width={"500px"}
        >
            <CategoriesGrid categories={categories} refetchCategories={refetchCategories}></CategoriesGrid>
        </SideSheet >
    );
};

export default ManageCategoriesSidesheet;