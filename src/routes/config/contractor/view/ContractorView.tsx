import React, { useMemo, useState } from 'react';
import { Grid, Typography, makeStyles, Theme } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { DeleteIcon, EditIcon } from '@fluentui/react-icons';
import {
  PrimaryActionHeader,
  OpenPage,
  SubHeaderAction,
} from 'unity-fluent-library';

import { useFleetQuery, useFleetMutation } from '../../../../api/query';
import {
  getContractorById,
  deleteContractorById,
  getContractorRates,
} from '../../../../api/client';
import { ContractorRecord, ContractorRateRecord } from '../../../../api/models';
import formatCurrency from '../../../../utils/formatCurrency';

import Table from '../../../../components/Table';
import ConfirmDelete from '../../../../components/ConfirmDelete';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import CreateEditContractor from '../CreateEditContractor';
import formatPhoneNumber from '../../../../utils/formatPhoneNumber';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  addressContainer: {
    paddingBottom: '1em',
  },
}));

const ContractorView = () => {
  const classes = useStyles();
  const history = useHistory();

  const { contractorId: _contractorId } = useParams<{ contractorId: string }>();
  const contractorId = parseInt(_contractorId, 10);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Delete contractor mutation
  const deleteMutation = useFleetMutation(({ id }: ContractorRecord) =>
    deleteContractorById(id)
  );

  // Main contractor data
  const {
    result: contractor,
    error: fetchContractorError,
    refetch: refetchContractor,
  } = useFleetQuery(['/contractor', contractorId], () =>
    getContractorById(contractorId)
  );

  const datasource = useMemo(
    () => ({
      getRows: ({
        startRow,
        endRow,
        // filterModel,
        successCallback,
        failCallback,
      }: any) => {
        // const queryParams = Object.entries<any>(
        //   filterModel
        // ).reduce<any>((params, [key, { filter }]) => {
        //   params[key.toLowerCase()] = filter;
        //   return params;
        // }, {});

        getContractorRates(contractorId, {
          // ...queryParams,
          page: startRow / 10 + 1,
          limit: endRow - startRow,
        })
          .then(response => {
            successCallback(
              response.data,
              response.pages.nextPage ? -1 : startRow + response.data.length
            );
          })
          .catch(error => failCallback());
      },
    }),
    [contractorId]
  );

  const error = fetchContractorError;

  if (error) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={error}
      />
    );
  }

  const closeSideSheet = (updated = false) => {
    setEditOpen(false);
    if (updated) refetchContractor();
  };

  return (
    <>
      {contractor && (
        <CreateEditContractor
          open={editOpen}
          close={closeSideSheet}
          current={contractor}
        />
      )}

      {contractor && (
        <ConfirmDelete
          open={deleteOpen}
          deleteItem={() => deleteMutation.mutateAsync(contractor)}
          handleClose={(deleted: boolean) => {
            if (deleted) history.goBack();
            setDeleteOpen(false);
          }}
        />
      )}

      <SubHeaderAction>
        <PrimaryActionHeader
          title={contractor ? contractor.contractorName : ''}
          buttonLabel="Edit"
          handleClick={() => setEditOpen(true)}
          clickBack={() => history.goBack()}
          icon={<EditIcon style={{ fontSize: 16 }} />}
          secondaryButtons={[
            {
              id: 1,
              label: 'Delete',
              click: () => setDeleteOpen(true),
              component: DeleteIcon,
            },
          ]}
        />
      </SubHeaderAction>

      <OpenPage disableGutters>
        <Grid
          container
          className={classes.container}
          spacing={2}
          direction="column"
        >
          <Grid item>
            <Typography variant="h6">Details</Typography>
          </Grid>
          {/* TODO: replace with a person card */}
          <Grid item>
            {contractor ? (
              <div className={classes.addressContainer}>
                <Typography variant="body2">{contractor.address1}</Typography>
                <Typography variant="body2">
                  {`${contractor.city}, ${contractor.stateAbbr} ${contractor.zip}`}
                </Typography>
                <Typography variant="body2">
                  Phone: {formatPhoneNumber(contractor.phone)}
                </Typography>
                <Typography variant="body2">
                  Fax: {formatPhoneNumber(contractor.fax)}
                </Typography>
              </div>
            ) : null}
          </Grid>

          <Grid item>
            <Typography variant="h6">Inventory</Typography>
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Table<ContractorRateRecord>
              suppressCellSelection={true}
              autoSizeToFit={true}
              rowModelType="infinite"
              cacheBlockSize={10}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
              infiniteInitialRowCount={1}
              columnDefs={[
                {
                  field: 'constructionUnitCode',
                  headerName: 'Construction Unit Code',
                },
                {
                  field: 'installPrice',
                  headerName: 'Install Price',
                  type: 'rightAligned',
                  valueFormatter: ({ value }) => formatCurrency(value),
                },
                {
                  field: 'removePrice',
                  headerName: 'Remove Price',
                  type: 'rightAligned',
                  valueFormatter: ({ value }) => formatCurrency(value),
                },
                {
                  field: 'maintainPrice',
                  headerName: 'Maintain Price',
                  type: 'rightAligned',
                  valueFormatter: ({ value }) => formatCurrency(value),
                },
              ]}
              datasource={datasource}
            />
          </Grid>
        </Grid>
      </OpenPage>
    </>
  );
};

export default ContractorView;
