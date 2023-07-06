import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createListCode, updateListCodeById } from '../../../api/client';
import { ListCodeRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  listCode: Yup.string()
    .required('Required')
    .max(20, 'Must be 20 characters or less'),
  listCodeDescription: Yup.string()
    .required('Required')
    .max(40, 'Must be 40 characters or less'),
  featureType: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
});

const CreateEditListCode = ({
  open,
  current,
  close,
}: CreateEditPageProps<ListCodeRecord>) => {
  const initialValues = {
    listCode: current?.listCode || '',
    listCodeDescription: current?.listCodeDescription || '',
    featureType: current?.featureType || '',
  };

  const createEditMutation = useFleetMutation(
    (listCodeData: typeof initialValues) =>
      current
        ? updateListCodeById(current.id, {
            ...listCodeData,
            id: current.id,
            version: current.version,
          })
        : createListCode(listCodeData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit List Code"
      createTitle="Create a List Code"
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
                label="List Code"
                name="listCode"
                disabled={!!current}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Description"
                name="listCodeDescription"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="Feature Type"
                name="featureType"
                disabled={!!current}
                required
              />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditListCode;
