import React from 'react';
import { Grid, InputAdornment } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createEmployee, updateEmployeeById } from '../../../api/client';
import { EmployeeRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  employeeCode: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
  firstName: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
  lastName: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
  emailAddress: Yup.string()
    .email('Must be a valid email address.')
    .max(255, 'Must be 255 characters or less'),
  regularRate: Yup.number()
    .min(0, 'Must be a valid rate.')
    .typeError('Must be a valid rate.'),
  overtimeRate: Yup.number()
    .min(0, 'Must be a valid rate.')
    .typeError('Must be a valid rate.'),
});

const CreateEditEmployee = ({
  open,
  current,
  close,
}: CreateEditPageProps<EmployeeRecord>) => {
  const initialValues = {
    employeeCode: current?.employeeCode || '',
    firstName: current?.firstName || '',
    lastName: current?.lastName || '',
    emailAddress: current?.emailAddress,
    regularRate: current?.regularRate,
    overtimeRate: current?.overtimeRate,
  };

  const createEditMutation = useFleetMutation(
    (employeeData: typeof initialValues) =>
      current
        ? updateEmployeeById(current.id, {
            ...employeeData,
            id: current.id,
            version: current.version,
          })
        : createEmployee(employeeData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit Employee"
      createTitle="Create an Employee"
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
                label="Employee Code"
                name="employeeCode"
                disabled={!!current}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="First Name" name="firstName" required />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="Last Name" name="lastName" required />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="Email Address" name="emailAddress" />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Regular Rate"
                name="regularRate"
                type="number"
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
                label="Overtime Rate"
                name="overtimeRate"
                type="number"
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

export default CreateEditEmployee;
