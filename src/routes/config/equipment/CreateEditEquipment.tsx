import React from 'react';
import {
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Field, FieldProps } from 'formik';
import { AmbientCard, FluentCheckbox } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createEquipment, updateEquipmentById } from '../../../api/client';
import { EquipmentRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  equipmentCode: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
  description: Yup.string()
    .required('Required')
    .max(50, 'Must be 60 characters or less'),
  dailyMileage: Yup.boolean(),
  mileageRate: Yup.number()
    .min(0, 'Must be a valid rate.')
    .typeError('Must be a valid rate.'),
  hourlyRate: Yup.number()
    .min(0, 'Must be a valid rate.')
    .typeError('Must be a valid rate.'),
});

const CreateEditEquipment = ({
  open,
  current,
  close,
}: CreateEditPageProps<EquipmentRecord>) => {
  const initialValues = {
    equipmentCode: current?.equipmentCode || '',
    description: current?.description || '',
    mileageRate: current?.mileageRate,
    dailyMileage: current?.dailyMileage,
    hourlyRate: current?.hourlyRate,
  };

  const createEditMutation = useFleetMutation(
    (equipmentData: typeof initialValues) =>
      current
        ? updateEquipmentById(current.id, {
            ...equipmentData,
            id: current.id,
            version: current.version,
          })
        : createEquipment(equipmentData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit Equipment"
      createTitle="Create an Equipment"
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
                label="Equipment Code"
                name="equipmentCode"
                disabled={!!current}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Description"
                name="description"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <Field name="dailyMileage" type="checkbox">
                  {({ field, meta }: FieldProps) => (
                    <FormControlLabel
                      style={{ fontSize: 14 }}
                      control={<FluentCheckbox {...field} />}
                      label="Daily Mileage"
                    />
                  )}
                </Field>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Mileage Rate"
                name="mileageRate"
                type="number"
                required
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Hourly Rate"
                name="hourlyRate"
                type="number"
                required
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditEquipment;
