import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createBudget, updateBudgetById } from '../../../api/client';
import { BudgetRecord } from '../../../api/models';
import { FormikTextField } from '../../../components/fields/TextField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  budgetNumber: Yup.string()
    .required('Required')
    .max(10, 'Must be 10 characters or less'),
  description: Yup.string()
    .required('Required')
    .max(60, 'Must be 60 characters or less'),
});

const CreateEditBudget = ({
  open,
  current,
  close,
}: CreateEditPageProps<BudgetRecord>) => {
  const initialValues = {
    budgetNumber: current?.budgetNumber || '',
    description: current?.description || '',
  };

  const createEditMutation = useFleetMutation(
    (budgetData: typeof initialValues) =>
      current
        ? updateBudgetById(current.id, {
            ...budgetData,
            id: current.id,
            version: current.version,
          })
        : createBudget(budgetData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Edit Budget"
      createTitle="Create a Budget"
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
                label="Budget Number"
                name="budgetNumber"
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

export default CreateEditBudget;
