import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetQuery, useFleetMutation } from '../../../../api/query';
import {
  createStock,
  updateStockById,
  getStockById,
} from '../../../../api/client';
import { StockRecord } from '../../../../api/models';
import boolToString from '../../../../utils/boolToString';
import { FormikTextField } from '../../../../components/fields/TextField';
import { FormikPickerField } from '../../../../components/fields/PickerField';
import Picker from '../../../../components/picker/Picker';
import UnitOfMeasurePicker from '../../../../components/picker/UnitOfMeasurePicker';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import { BaseCreateEditPage, CreateEditPageProps } from '../../base';
import ManageWarehouses from './ManageWarehouses';

// TODO: validate stockWarehouses
const validationSchema = Yup.object({
  stockNumber: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less.'),
  description: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less.'),
  available: Yup.string().oneOf(['true', 'false']),
  majorItem: Yup.string().oneOf(['true', 'false']),
  ratio: Yup.number(),
  issueUnitOfMeasureId: Yup.number().required('Required'),
  purchaseUnitOfMeasureId: Yup.number().required('Required'),
  // accountId: Yup.number().required('Required'),
  // glAccount: Yup.string().required('Required'),
});

const CreateEditStock = ({
  open,
  current: _current,
  close,
}: CreateEditPageProps<StockRecord>) => {
  const params = { includeChildren: true };

  const { result: current, error } = useFleetQuery(
    ['/stock', _current?.id, params],
    () => getStockById(_current!.id, params),
    { enabled: !!_current, refetchOnWindowFocus: false }
  );

  const initialValues = {
    stockNumber: current?.stockNumber || '',
    description: current?.description || '',
    available: current !== undefined ? boolToString(current.available) : '',
    majorItem: current !== undefined ? boolToString(current.majorItem) : '',
    ratio: current !== undefined ? current.ratio : 1,
    issueUnitOfMeasureId: current?.issueUnitOfMeasureId,
    purchaseUnitOfMeasureId: current?.purchaseUnitOfMeasureId,
    // accountId: current?.accountId || null,
    // glAccount: current?.glAccount || '',
    stockWarehouses: current?.stockWarehouses || [],
  };

  const createEditMutation = useFleetMutation(
    (formValues: typeof initialValues) => {
      const stockData: Partial<StockRecord> = {
        ...formValues,
        ratio:
          typeof formValues.ratio === 'string'
            ? formValues.ratio
              ? parseInt(formValues.ratio, 10)
              : undefined
            : formValues.ratio,
        available: formValues.available === 'true' ? true : false,
        majorItem: formValues.majorItem === 'true' ? true : false,
        stockWarehouses: formValues.stockWarehouses,
      };

      return current
        ? updateStockById(
            current.id,
            {
              ...stockData,
              id: current.id,
              version: current.version,
            },
            params
          )
        : createStock(stockData, params);
    }
  );

  if (error) {
    // TODO: upgrade typescript to fix "error" being seen as null (hence ! is used)
    return <ErrorDisplay error={error!} />;
  }

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit Stock"
      createTitle="Create a stock"
      current={current}
      close={close}
      createEditMutation={createEditMutation}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AmbientCard fullWidth header>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormikTextField
                  label="Stock"
                  name="stockNumber"
                  disabled={!!current}
                  required
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormikGlAccountPicker
                  idFieldName="accountId"
                  displayFieldName="glAccount"
                  required
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormikTextField
                  label="Description"
                  name="description"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikPickerField name="available">
                  {props => (
                    <Picker
                      {...props}
                      label="Installable"
                      options={[
                        { label: 'Installable', value: 'true' },
                        { label: 'Obsolete', value: 'false' },
                      ]}
                      fullWidth
                    />
                  )}
                </FormikPickerField>
              </Grid>
              <Grid item xs={12}>
                <FormikPickerField name="majorItem">
                  {props => (
                    <Picker
                      {...props}
                      label="Physical Inventory Item"
                      options={[
                        { label: 'Physical Inventory Item', value: 'true' },
                        { label: 'Not Counted', value: 'false' },
                      ]}
                      fullWidth
                    />
                  )}
                </FormikPickerField>
              </Grid>
              <Grid item xs={4}>
                <FormikPickerField name="issueUnitOfMeasureId">
                  {props => (
                    <UnitOfMeasurePicker {...props} label="Issue By UOM" />
                  )}
                </FormikPickerField>
              </Grid>
              <Grid item xs={4}>
                <FormikPickerField name="purchaseUnitOfMeasureId">
                  {props => (
                    <UnitOfMeasurePicker {...props} label="Purchase By UOM" />
                  )}
                </FormikPickerField>
              </Grid>
              <Grid item xs={4}>
                <FormikTextField label="Ratio" name="ratio" type="number" />
              </Grid>
            </Grid>
          </AmbientCard>
        </Grid>
        <ManageWarehouses />
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditStock;
