import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetMutation } from '../../../api/query';
import { createContractor, updateContractorById } from '../../../api/client';
import { ContractorRecord } from '../../../api/models';
import { stateAbbrs } from '../../../data/states';
import StatePicker from '../../../components/picker/StatePicker';
import { FormikTextField } from '../../../components/fields/TextField';
import { FormikPickerField } from '../../../components/fields/PickerField';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';

const validationSchema = Yup.object({
  contractorName: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less.'),
  address1: Yup.string().max(60, 'Must be 60 characters or less.'),
  address2: Yup.string().max(60, 'Must be 60 characters or less.'),
  city: Yup.string().max(40, 'Must be 40 characters or less.'),
  stateAbbr: Yup.string().oneOf(
    stateAbbrs,
    'State abbreviation was not recognized.'
  ),
  zip: Yup.string().max(10, 'Must be 10 characters or less.'),
  // TODO: validate phone and fax as phone #
  phone: Yup.string().max(10, 'Must be 10 characters or less.'),
  fax: Yup.string().max(10, 'Must be 10 characters or less.'),
});

export const CreateEditContractor = ({
  open,
  current,
  close,
}: CreateEditPageProps<ContractorRecord>) => {
  const initialValues = {
    contractorName: current?.contractorName || '',
    address1: current?.address1 || '',
    address2: current?.address2 || '',
    city: current?.city || '',
    stateAbbr: current?.stateAbbr || '',
    zip: current?.zip || '',
    phone: current?.phone || '',
    fax: current?.fax || '',
  };

  const createEditMutation = useFleetMutation(
    (contractorData: typeof initialValues) =>
      current
        ? updateContractorById(current.id, {
            ...contractorData,
            id: current.id,
            version: current.version,
          })
        : createContractor(contractorData)
  );

  return (
    <BaseCreateEditPage
      open={open}
      editTitle="Contractor"
      createTitle="Create a contractor"
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
              <FormikTextField label="Name" name="contractorName" required />
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
            <Grid item xs={12}>
              <FormikTextField label="Phone Number" name="phone" />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField label="Fax" name="fax" />
            </Grid>
          </Grid>
        </AmbientCard>
      </Grid>
    </BaseCreateEditPage>
  );
};

export default CreateEditContractor;
