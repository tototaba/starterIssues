import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Form,
    Field,
    SideSheet
} from "unity-fluent-library"
import {
    TextField,
} from '@material-ui/core';

const CategorySideSheet = ({ open, onClose, action, isEdit = false, selectedCategory }) => {
    const formRef = useRef(null);

    const dialogTitle = isEdit ? "Edit Category" : "Create a New Category";
    const labelOne = isEdit ? "Save" : "Create";

    const onSubmit = (e) => {
        return "not implmented"
    }

    return (
        <SideSheet
            onClose={onClose}
            width={"400px"}
            title={dialogTitle}
            open={open}
            onSubmit={() => {
                action(formRef.current.values)
                onClose()
            }}
            buttonLabel={labelOne}
        >
            <Form ref={formRef} onSubmit={onSubmit}>
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
                    initialValue={isEdit ? selectedCategory?.title : ""}
                />
            </Form>
        </SideSheet >
    );
};

export default CategorySideSheet;
