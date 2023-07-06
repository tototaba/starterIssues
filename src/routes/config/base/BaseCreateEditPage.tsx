import React, { useRef } from 'react';
import { makeStyles, Theme, Grid } from '@material-ui/core';
import { Formik, Form, FormikConfig, FormikProps, FormikBag } from 'formik';
import { SideSheet } from 'unity-fluent-library';

import { UseFleetMutationResult } from '../../../api/query';
import ErrorDisplay from '../../../components/ErrorDisplay';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    paddingBottom: theme.spacing(1),
  },
  tableContainer: {
    padding: theme.spacing(4),
  },
  createRoot: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
  },
}));

interface BaseCreateEditPageProps<RecordType, Values> {
  children: React.ReactNode | ((props: FormikProps<Values>) => React.ReactNode);
  viewTitle?: string;
  editTitle?: string;
  createTitle?: string;
  current?: RecordType;
  open?: boolean;
  viewOnly?: boolean;
  close: (updated?: boolean) => void;
  createEditMutation: UseFleetMutationResult<Values>;
  initialValues: FormikConfig<Values>['initialValues'];
  enableReinitialize?: boolean;
  validate?: FormikConfig<Values>['validate'];
  validationSchema?: FormikConfig<Values>['validationSchema'];
}

const BaseCreateEditPage = <RecordType, Values>({
  open,
  viewOnly = false,
  children,
  current,
  viewTitle,
  editTitle,
  createTitle,
  close,
  createEditMutation,
  initialValues,
  enableReinitialize = false,
  validate = undefined,
  validationSchema = undefined,
}: BaseCreateEditPageProps<RecordType, Values>) => {
  const classes = useStyles();
  const formikBagRef = useRef<FormikBag<typeof initialValues, any>>();

  return (
    <SideSheet
      open={open}
      onClose={close}
      title={viewOnly ? viewTitle : current ? editTitle : createTitle}
      {...(!viewOnly
        ? {
            buttonLabel: current ? 'Update' : 'Create',
            onSubmit: () => formikBagRef.current?.submitForm(),
            // enableSubmit: dirty && !isSubmitting
          }
        : {})}
      width={450}
    >
      <Formik
        innerRef={formikBagRef as any}
        initialValues={initialValues}
        initialStatus={{ error: null }}
        enableReinitialize={enableReinitialize}
        validate={validate}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, setStatus }) => {
          if (viewOnly) return;

          createEditMutation.mutate(values, {
            onError: error => {
              try {
                if (error.isAxiosError) {
                  console.error(error, error.response?.data ?? error.toJSON());
                } else {
                  console.error(error);
                }
                setStatus({ error });
              } catch (err) {
                alert('Something is terribly wrong.');
              }
            },
            onSuccess: () => {
              close(true);
            },
            onSettled: () => {
              setSubmitting(false);
            },
          });
        }}
      >
        {formikProps => {
          const {
            status: { error },
          } = formikProps;

          return (
            <Form autoComplete="off">
              <Grid container className={classes.createRoot} spacing={1}>
                {typeof children === 'function'
                  ? children(formikProps)
                  : children}
              </Grid>
              {error && <ErrorDisplay error={error} />}
            </Form>
          );
        }}
      </Formik>
    </SideSheet>
  );
};

export default BaseCreateEditPage;
