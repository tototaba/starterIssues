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
  getWarehouseById,
  getWarehouseStock,
  deleteWarehouseById,
} from '../../../../api/client';
import { WarehouseRecord, WarehouseStockRecord } from '../../../../api/models';

import Table from '../../../../components/Table';
import ConfirmDelete from '../../../../components/ConfirmDelete';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import CreateEditWarehouse from '../CreateEditWarehouse';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  addressContainer: {
    paddingBottom: '1em',
  },
}));

const WarehouseView = () => {
  const classes = useStyles();
  const history = useHistory();

  const { warehouseId: _warehouseId } = useParams<{ warehouseId: string }>();
  const warehouseId = parseInt(_warehouseId, 10);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Delete warehouse mutation
  const deleteMutation = useFleetMutation(({ id }: WarehouseRecord) =>
    deleteWarehouseById(id)
  );

  // Main warehouse data
  const {
    result: warehouse,
    error: fetchWarehouseError,
    refetch: refetchWarehouse,
  } = useFleetQuery(['/warehouse', warehouseId], () =>
    getWarehouseById(warehouseId)
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

        getWarehouseStock(warehouseId, {
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
    [warehouseId]
  );

  const error = fetchWarehouseError;

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
    if (updated) refetchWarehouse();
  };

  return (
    <>
      {warehouse && (
        <CreateEditWarehouse
          open={editOpen}
          close={closeSideSheet}
          current={warehouse}
        />
      )}

      {warehouse && (
        <ConfirmDelete
          open={deleteOpen}
          deleteItem={() => deleteMutation.mutateAsync(warehouse)}
          handleClose={(deleted: boolean) => {
            if (deleted) history.goBack();
            setDeleteOpen(false);
          }}
        />
      )}

      <SubHeaderAction>
        <PrimaryActionHeader
          title={
            warehouse
              ? `${warehouse.warehouseName} (${warehouse.warehouseCode})`
              : ''
          }
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
            <Typography variant="h6">Location</Typography>
          </Grid>
          <Grid item>
            {warehouse ? (
              <div className={classes.addressContainer}>
                <Typography variant="body2">{warehouse.address1}</Typography>
                <Typography variant="body2">{`${warehouse.city}, ${warehouse.stateAbbr} ${warehouse.zip}`}</Typography>
              </div>
            ) : null}
          </Grid>

          <Grid item>
            <Typography variant="h6">Inventory</Typography>
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Table<WarehouseStockRecord>
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
                  field: 'stockNumber',
                  headerName: 'Stock',
                  cellRenderer: 'linkRenderer',
                  cellRendererParams: {
                    getPath: ({ stockId }: WarehouseStockRecord) =>
                      `/Stock/${stockId}`,
                  },
                },
                { field: 'fercAccount', headerName: 'FERC Account' },
                { field: 'row', headerName: 'Row' },
                { field: 'shelf', headerName: 'Shelf' },
                { field: 'bin', headerName: 'Bin' },
                {
                  field: 'quantityInStock',
                  headerName: 'Quantity In Stock',
                },
                { field: 'orderPoint', headerName: 'Order Point' },
                {
                  field: 'reorderQuantity',
                  headerName: 'Reorder Quantity',
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

export default WarehouseView;
