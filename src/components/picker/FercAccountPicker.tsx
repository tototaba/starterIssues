import React, { useState } from 'react';
import { SearchIcon } from '@fluentui/react-icons';
import { InputAdornment } from '@material-ui/core';
import { useField } from 'formik';
import { FluentIconButton } from 'unity-fluent-library';

import FercSearchModal from '../search/FercSearchModal';
import { FormikTextField } from '../fields/TextField';

interface FormikFercAccountPickerProps {
  idFieldName: string;
  displayFieldName: string;
  label?: string;
  required?: boolean;
}

export const FormikFercAccountPicker = ({
  idFieldName,
  displayFieldName,
  label = 'FERC Account',
  required = false,
}: FormikFercAccountPickerProps) => {
  const [, , idFieldHelpers] = useField(idFieldName);
  const [, , displayFieldHelpers] = useField(displayFieldName);
  const [searchModalIsOpen, setSearchModalIsOpen] = useState(false);

  return (
    <>
      <FormikTextField
        name={displayFieldName}
        label={label}
        required={required}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <FluentIconButton
                icon={SearchIcon}
                aria-label="Search FERC Accounts"
                onClick={() => setSearchModalIsOpen(true)}
              />
            </InputAdornment>
          ),
        }}
      />
      <FercSearchModal
        open={searchModalIsOpen}
        handleClose={selected => {
          if (selected) {
            idFieldHelpers.setValue(selected.id);
            displayFieldHelpers.setValue(selected.fercAccount);
          }
          setSearchModalIsOpen(false);
        }}
      />
    </>
  );
};
