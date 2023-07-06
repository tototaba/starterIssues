import React, { useState } from 'react';
import { SearchIcon } from '@fluentui/react-icons';
import { InputAdornment } from '@material-ui/core';
import { useField } from 'formik';
import { FluentIconButton } from 'unity-fluent-library';

import WarehouseSearchModal from '../search/WarehouseSearchModal';
import { FormikTextField } from '../fields/TextField';

interface FormikWarehousePickerProps {
  idFieldName: string;
  displayFieldName: string;
  label?: string;
  required?: boolean;
}

// TODO: Currently the search modal only supports multiselect, so this picker returns the first selected item.
//       WarehouseSearchModal needs to be extended with a single selection mode to fix this picker.
export const FormikWarehousePicker = ({
  idFieldName,
  displayFieldName,
  label = 'Warehouse',
  required = false,
}: FormikWarehousePickerProps) => {
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
                aria-label="Search Warehouses"
                onClick={() => setSearchModalIsOpen(true)}
                icon={SearchIcon}
              />
            </InputAdornment>
          ),
        }}
      />
      <WarehouseSearchModal
        exclude={[]}
        open={searchModalIsOpen}
        handleClose={(selected, selectedData) => {
          const firstWarehouse =
            selected &&
            selectedData &&
            selected[0] &&
            selectedData[selected[0]];

          if (firstWarehouse) {
            idFieldHelpers.setValue(firstWarehouse.id);
            displayFieldHelpers.setValue(firstWarehouse.warehouseName);
          }

          setSearchModalIsOpen(false);
        }}
      />
    </>
  );
};
