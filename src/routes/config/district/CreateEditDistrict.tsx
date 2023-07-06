import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard, FluentTextField } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createDistrict, updateDistrictById } from '../../../api/client';
import { DistrictRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  districtCode: Yup.string()
    .required('Required')
    .max(5, 'Must be 5 characters or less'),
  districtName: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less'),
});

const CreateEditDistrict = ({
  open,
  current,
  close,
}: CreateEditPageProps<DistrictRecord>) => {
  const initialValues = {
    districtCode: current?.districtCode || '',
    districtName: current?.districtName || '',
  };

  const createEditMutation = useFleetMutation(
    (districtData: typeof initialValues) =>
      current
        ? updateDistrictById(current.id, {
            ...districtData,
            id: current.id,
            version: current.version,
          })
        : createDistrict(districtData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit District"
      createTitle="Create a District"
      current={current}
      close={close}
      createEditMutation={createEditMutation}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Grid item xs={12}>
        <AmbientCard fullWidth header>
          <Grid container spacing={1}>
            {current && (
              <Grid item xs={12}>
                <FluentTextField
                  label="District GUID"
                  name="districtGuid"
                  value={current.districtGuid}
                  disabled={true}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormikTextField
                label="District Code"
                name="districtCode"
                disabled={!!current}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                label="District Name"
                name="districtName"
                required
              />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditDistrict;
