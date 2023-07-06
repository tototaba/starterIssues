import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createWarehouse, updateWarehouseById } from '../../../api/client';
import { WarehouseRecord } from '../../../api/models';
import { stateAbbrs } from '../../../data/states';
import { FormikFercAccountPicker } from '../../../components/picker/FercAccountPicker';
import StatePicker from '../../../components/picker/StatePicker';
import { FormikTextField } from '../../../components/fields/TextField';
import { FormikPickerField } from '../../../components/fields/PickerField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  warehouseCode: Yup.string()
    .required('Required')
    .max(10, 'Must be 10 characters or less.'),
  warehouseName: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less.'),
  accountId: Yup.number().integer(),
  fercAccount: Yup.string(),
  address1: Yup.string().max(60, 'Must be 60 characters or less.'),
  address2: Yup.string().max(60, 'Must be 60 characters or less.'),
  city: Yup.string().max(40, 'Must be 40 characters or less.'),
  stateAbbr: Yup.string().oneOf(
    stateAbbrs,
    'State abbreviation was not recognized.'
  ),
  zip: Yup.string().max(10, 'Must be 10 characters or less.'),
});

export const CreateEditWarehouse = ({
  open,
  current,
  close,
}: CreateEditPageProps<WarehouseRecord>) => {
  const initialValues = {
    warehouseCode: current?.warehouseCode || '',
    warehouseName: current?.warehouseName || '',
    accountId: current?.accountId || undefined,
    fercAccount: current?.fercAccount || '',
    address1: current?.address1 || '',
    address2: current?.address2 || '',
    city: current?.city || '',
    stateAbbr: current?.stateAbbr || '',
    zip: current?.zip || '',
  };

  const createEditMutation = useFleetMutation(
    (warehouseData: typeof initialValues) =>
      current
        ? updateWarehouseById(current.id, {
            ...warehouseData,
            id: current.id,
            version: current.version,
          })
        : createWarehouse(warehouseData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Warehouse"
      createTitle="Create a warehouse"
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
                disabled={!!current}
                label="Warehouse Code"
                name="warehouseCode"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Warehouse Name"
                name="warehouseName"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikFercAccountPicker
                idFieldName="accountId"
                displayFieldName="fercAccount"
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="Address 1" name="address1" />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="Address 2" name="address2" />
            </Grid>
            <Grid item xs={4}>
              <FormikTextField label="City" name="city" />
            </Grid>
            <Grid item xs={4}>
              <FormikPickerField name="stateAbbr">
                {props => <StatePicker {...props} />}
              </FormikPickerField>
            </Grid>
            <Grid item xs={4}>
              <FormikTextField label="ZIP Code" name="zip" />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditWarehouse;
