import React, { useState } from 'react';
import {
    Field,
    FluentTextFieldAutoComplete,
    FluentButton,
} from 'unity-fluent-library';
import { Box } from '@mui/material';
import CategorySideSheet from './CategorySideSheet';
import ManageCategoriesSidesheet from './ManageCategoriesSidesheet';

const CategoryManager = ({
    categories,
    selectedMeetingItem,
    refetchCategories,
    handleCategoryCreate
}) => {
    const [CreateCategoryOpen, setCreateCategoryOpen] = useState(false);
    const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);

    return (
        <>
            <Field
                component={FluentTextFieldAutoComplete}
                label="Category"
                id="Category"
                name="category"
                fullWidth
                variant="outlined"
                required
                options={categories}
                optionKey="title"
                style={{ marginTop: '1.25rem', marginBottom: '1rem', display: 'block' }}
                initialValue={
                    selectedMeetingItem
                        ? categories.find(
                            (category) => category.id === selectedMeetingItem.category_id
                        )
                        : null
                }
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center',
                }}
            >
                <FluentButton
                    variant="outlined"
                    color="primary"
                    style={{ width: '220px' }}
                    onClick={() => setCreateCategoryOpen(true)}
                >
                    Create A New Category
                </FluentButton>
                <FluentButton
                    variant="outlined"
                    color="primary"
                    style={{ width: '220px' }}
                    onClick={() => setManageCategoriesOpen(true)}
                >
                    Manage Existing Categories
                </FluentButton>
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
            </Box>
        </>
    );
};

export default CategoryManager;
