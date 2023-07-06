import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import {
  createUnitOfMeasure,
  updateUnitOfMeasureById,
} from '../../../api/client';
import { UnitOfMeasureRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
// import { FormikPickerField } from '../../../components/fields/PickerField';
// import UnitOfMeasureTypePicker from '../../../components/picker/UnitOfMeasureTypePicker';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  unitOfMeasure: Yup.string()
    .required('Required')
    .max(20, 'Must be 20 characters or less.'),
  unitOfMeasureDescription: Yup.string()
    .required('Required')
    .max(40, 'Must be 40 characters or less.'),
  // unitOfMeasureTypeId: Yup.number().integer().required('Required'),
});

const CreateEditUnitOfMeasure = ({
  open,
  current,
  close,
}: CreateEditPageProps<UnitOfMeasureRecord>) => {
  const initialValues = {
    unitOfMeasure: current?.unitOfMeasure || '',
    unitOfMeasureDescription: current?.unitOfMeasureDescription || '',
    // unitOfMeasureTypeId: current?.unitOfMeasureTypeId || null,
  };

  const createEditMutation = useFleetMutation(
    (formValues: typeof initialValues) => {
      const unitOfMeasureData: Partial<UnitOfMeasureRecord> = {
        ...formValues,
        // note: theoretically this will never actually be undefined, because otherwise the form validation should fail before
        // unitOfMeasureTypeId: formValues.unitOfMeasureTypeId || undefined,
      };

      return current
        ? updateUnitOfMeasureById(current.id, {
            ...unitOfMeasureData,
            id: current.id,
            version: current.version,
          })
        : createUnitOfMeasure(unitOfMeasureData);
    }
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit Unit of Measure"
      createTitle="Create a Unit of Measure"
      current={current}
      close={close}
      createEditMutation={createEditMutation}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Grid item xs={12}>
        <AmbientCard fullWidth header>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormikTextField
                label="Unit"
                name="unitOfMeasure"
                disabled={!!current}
                required
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormikPickerField name="unitOfMeasureTypeId">
                {props => (
                  <UnitOfMeasureTypePicker
                    {...props}
                    label="Type"
                    fullWidth
                    required
                  />
                )}
              </FormikPickerField>
            </Grid> */}
            <Grid item xs={12}>
              <FormikTextField
                label="Description"
                name="unitOfMeasureDescription"
                required
              />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditUnitOfMeasure;
