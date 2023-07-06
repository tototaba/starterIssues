import React from 'react';
import { Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { AmbientCard } from 'unity-fluent-library';

import { useFleetQuery, useFleetMutation } from '../../../api/query';
import {
  getAssemblyById,
  createAssembly,
  updateAssemblyById,
  getSubassemblyById,
  createSubassembly,
  updateSubassemblyById,
  getListCodes,
} from '../../../api/client';
import {
  AssemblyRecord,
  SubassemblyRecord,
  CommonAssemblyRecord,
  ListCodeRecord,
} from '../../../api/models';
import boolToString from '../../../utils/boolToString';

import Picker from '../../../components/picker/Picker';
import ListCodePicker from '../../../components/picker/ListCodePicker';
import { FormikTextField } from '../../../components/fields/TextField';
import { FormikPickerField } from '../../../components/fields/PickerField';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { BaseCreateEditPage, CreateEditPageProps } from '../base';
import {
  ManageAssemblyChildren,
  ManageSubassemblyChildren,
} from './ManageChildren';

interface PageProps<RecordType> extends CreateEditPageProps<RecordType> {
  title: string;
  fetchPath: string;
  childrenKey: 'subassembly' | 'stock';
  getRecordById: RecordType extends AssemblyRecord
  ? typeof getAssemblyById
  : typeof getSubassemblyById;
  updateRecordById: RecordType extends AssemblyRecord
  ? typeof updateAssemblyById
  : typeof updateSubassemblyById;
  createRecord: RecordType extends AssemblyRecord
  ? typeof createAssembly
  : typeof createSubassembly;
  manageChildren: React.ComponentType;
}

const validationSchema = Yup.object({
  code: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less.'),
  description: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less.'),
  available: Yup.string().oneOf(['true', 'false']).required('Required'),
  listCode: Yup.string().required('Required'),
});

const CreateEditPage = <RecordType extends CommonAssemblyRecord>({
  open,
  current: _current,
  close,
  title,
  childrenKey,
  fetchPath,
  getRecordById,
  updateRecordById,
  createRecord,
  manageChildren: ManageChildrenComponent,
}: PageProps<RecordType>) => {
  const params = { includeChildren: true };

  const { result: current, error } = useFleetQuery<
    AssemblyRecord | SubassemblyRecord
  >(
    [fetchPath, _current?.id, params],
    () => getRecordById(_current!.id, params),
    { enabled: !!_current, refetchOnWindowFocus: false }
  );

  const { result: listCodes, error: fetchListCodeError } = useFleetQuery(
    ['/listcode', { limit: 100 }],
    () => getListCodes({ limit: 100 })
  );

  const initialValues = {
    code: current?.code || '',
    description: current?.description || '',
    available: current !== undefined ? boolToString(current.available) : '',
    listCode: current?.listCode || '',
    // listCodeId: current?.listCodeId || '',
    children: (current && (current as any)[childrenKey]) || [],
  };

  const createEditMutation = useFleetMutation(
    async ({ children, ...formValues }: typeof initialValues) => {
      // TODO: replace with picker modifications
      const listCodeId =
        listCodes &&
        listCodes.find(
          (code: ListCodeRecord) => code.listCode === formValues.listCode
        )?.id;

      // TODO: change to custom error class
      if (!listCodeId)
        throw new Error('Could not find the selected List Code.');

      const constructionUnitData = {
        ...formValues,
        [childrenKey]: children,
        available: formValues.available === 'true' ? true : false,
        listCodeId,
      };

      const response = await (current
        ? updateRecordById(
          current.id,
          {
            ...constructionUnitData,
            id: current.id,
            version: current.version,
          },
          params
        )
        : createRecord(constructionUnitData, params));

      return response;
    }
  );

  if (error || fetchListCodeError) {
    // TODO: upgrade typescript to fix "error" being seen as null (hence ! is used)
    return <ErrorDisplay error={error! || fetchListCodeError!} />;
  }

  return (
    <BaseCreateEditPage
      open={open}
      editTitle={`${title}`}
      createTitle={`Create ${title}`}
      current={current}
      enableReinitialize={true}
      close={close}
      createEditMutation={createEditMutation}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AmbientCard fullWidth header>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormikTextField
                  label={title} 
                  name="code"
                  disabled={!!current}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Project Short Code"
                  name="shortCode"
                  //required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Project Name"
                  name="projectName"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField
                  label="Date Started"
                  name="dateStarted"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField
                  label="Date Completed"
                  name="dateCompleted"
                  //required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Unit Number"
                  name="unitNumber"
                  //required
                />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField
                  label="Street Number"
                  name="streetNumber"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField
                  label="Street Name"
                  name="streetName"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="City"
                  name="city"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Province"
                  name="province"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Country"
                  name="country"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Postal Code"
                  name="postalCode"
                  required
                />
              </Grid>
            </Grid>
          </AmbientCard>
        </Grid>

        <ManageChildrenComponent />
      </Grid>
    </BaseCreateEditPage>
  );
};

export const CreateEditAssembly = (
  props: CreateEditPageProps<AssemblyRecord>
) => (
  <CreateEditPage
    {...props}
    title="Project"
    fetchPath="/assembly"
    childrenKey="subassembly"
    getRecordById={getAssemblyById}
    updateRecordById={updateAssemblyById}
    createRecord={createAssembly}
    manageChildren={() => <div/>}
  />
);

export const CreateEditSubassembly = (
  props: CreateEditPageProps<SubassemblyRecord>
) => (
  <CreateEditPage
    {...props}
    title="Meeting Details"
    fetchPath="/subassembly"
    childrenKey="stock"
    getRecordById={getSubassemblyById}
    updateRecordById={updateSubassemblyById}
    createRecord={createSubassembly}
    manageChildren={ManageSubassemblyChildren}
  />
);
