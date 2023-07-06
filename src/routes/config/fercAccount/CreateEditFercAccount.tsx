import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createFercAccount, updateFercAccountById } from '../../../api/client';
import { FercAccountRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  fercAccount: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less.'),
  description: Yup.string()
    .required('Required')
    .max(150, 'Must be 150 characters or less.'),
});

const CreateEditFercAccount = ({
  open,
  current,
  close,
}: CreateEditPageProps<FercAccountRecord>) => {
  const initialValues = {
    fercAccount: current?.fercAccount || '',
    description: current?.description || '',
  };

  const createEditMutation = useFleetMutation(
    (fercAccountData: typeof initialValues) =>
      current
        ? updateFercAccountById(current.id, {
            ...fercAccountData,
            id: current.id,
            version: current.version,
          })
        : createFercAccount(fercAccountData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit FERC Account"
      createTitle="Create a FERC Account"
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
                label="FERC Account"
                name="fercAccount"
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
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditFercAccount;
