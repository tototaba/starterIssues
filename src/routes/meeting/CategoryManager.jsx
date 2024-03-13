import React, { useState } from 'react';
import {
    Field,
    FluentTextFieldAutoComplete,
    FluentButton,
} from 'unity-fluent-library';
import { EditIcon } from '@fluentui/react-icons';
import { Box } from '@mui/material';
import CategorySideSheet from './CategorySideSheet';
import ManageCategoriesSidesheet from './ManageCategoriesSidesheet';

const CategoryManager = ({
    categories,
    selectedMeetingItem,
    refetchCategories,
    handleCategoryCreate,
}) => {
    const [ManageCategoriesOpen, setManageCategoriesOpen] = useState(false);

    return (
        <>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
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
                    style={{ marginTop: '1.25rem', marginBottom: '1rem', display: 'block', width: '275px', marginRight: '10px' }}
                    initialValue={
                        selectedMeetingItem
                            ? categories.find(
                                (category) => category.id === selectedMeetingItem.category_id
                            )
                            : null
                    }
                    udpRecordId='udpRecord-CategoryManager-Category'
                />

                <FluentButton
                    color="primary"
                    onClick={() => setManageCategoriesOpen(true)}
                >
                    <EditIcon style={{ marginRight: '10px' }}></EditIcon>
                    Manage Categories
                </FluentButton>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center',
                }}
            >
                <ManageCategoriesSidesheet
                    categories={categories}
                    refetchCategories={refetchCategories}
                    open={ManageCategoriesOpen}
                    onClose={() => {
                        setManageCategoriesOpen(false);
                    }}
                    handleCategoryCreate={handleCategoryCreate}
                ></ManageCategoriesSidesheet>

                {/* <CategorySideSheet
                    action={handleCategoryCreate}
                    open={CreateCategoryOpen}
                    onClose={() => {
                        setCreateCategoryOpen(false);
                    }}
                ></CategorySideSheet> */}
            </Box>
        </>
    );
};

export default CategoryManager;
