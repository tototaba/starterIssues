import React, { Fragment, useState } from 'react';
import { Grid, Typography, makeStyles, Theme, Paper } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
// import { AddIcon } from '@fluentui/react-icons';
import { DeleteIcon, EditIcon } from '@fluentui/react-icons';
import { useHistory, useParams } from 'react-router-dom';
import {
  SubHeaderAction,
  FluentCheckbox,
  PrimaryActionHeader,
} from 'unity-fluent-library';

import { useFleetQuery, useFleetMutation } from '../../../../api/query';
import {
  getStockById,
  getStockConstructionUnits,
  // getStockTransactions,
  deleteStockById,
} from '../../../../api/client';
import {
  StockRecord,
  // StockTransactionRecord,
  StockWarehouseRecord,
} from '../../../../api/models';
// import formatDate from '../../../../utils/formatDate';
import formatCurrency from '../../../../utils/formatCurrency';

import Table from '../../../../components/Table';
import ConfirmDelete from '../../../../components/ConfirmDelete';
import OpenPage from '../../../../components/OpenPage';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import CreateEditStock from '../ui/CreateEditStock';
// import CreateStockTransaction from '../ui/CreateStockTransaction';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  spacer: {},
  value: {
    fontWeight: 'bold',
  },
  tableCard: {
    padding: theme.spacing(2),
  },
  tableCardTitle: {
    marginBottom: theme.spacing(2),
  },
}));

const StockView = () => {
  const classes = useStyles();
  const history = useHistory();

  const { stockId: _stockId } = useParams<{ stockId: string }>();
  const stockId = parseInt(_stockId, 10);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const [createTransactionOpen, setCreateTransactionOpen] =
  //   useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Delete stock mutation
  const deleteMutation = useFleetMutation((item: StockRecord) =>
    deleteStockById(item.id)
  );

  // Main stock data
  const fetchStockParams = { includeChildren: true };
  const {
    result: stock,
    error: fetchStockError,
    refetch: refetchStock,
  } = useFleetQuery(['/stock', stockId, fetchStockParams], () =>
    getStockById(stockId, fetchStockParams)
  );

  // Stock construction units
  // TODO: paginate
  const { result: constructionUnits, error: fetchConstructionUnitsError } =
    useFleetQuery(
      ['/stock', stockId, '/constructionunit', { limit: 100 }],
      () => getStockConstructionUnits(stockId, { limit: 100 })
    );

  // // Stock transactions
  // // TODO: paginate
  // const { result: transactions, error: fetchTransactionError } = useFleetQuery(
  //   ['/stock', stockId, '/transaction', { limit: 100 }],
  //   () => getStockTransactions(stockId, { limit: 100 })
  // );

  const error = fetchStockError || fetchConstructionUnitsError;
  // fetchStockError || fetchConstructionUnitsError || fetchTransactionError;

  if (error) {
    return (
      <ErrorDisplay
        title="An error occurred while loading the data"
        error={error}
      />
    );
  }

  const warehouses = stock?.stockWarehouses ?? null;

  const closeSideSheet = (updated = false) => {
    setEditOpen(false);
    // setCreateTransactionOpen(false);
    if (updated) refetchStock();
  };

  const tabList = [
    {
      label: 'Stock',
      actionsRow: false,
      child: stock && (
        <Grid container spacing={4} direction="column">
          <Grid item container alignItems="center" style={{ paddingTop: 0 }}>
            {stock ? (
              <div
                style={{
                  display: 'grid',
                  columnGap: '16px',
                  margin: 'auto',
                  padding: '0 4px',
                  width: '100%',
                  gridTemplateColumns:
                    'repeat(2, auto auto minmax(32px, 1fr)) auto auto 0',
                  alignItems: 'center',
                }}
              >
                {(
                  [
                    // ['GL Account', stock.glAccount],
                    ['Purchase By UOM', stock?.purchaseUnitOfMeasure ?? ''],
                    ['Installable', stock.available],
                    ['Ratio', stock.ratio],
                    ['Issue By UOM', stock?.issueUnitOfMeasure ?? ''],
                    ['Physical Inventory', stock.majorItem],
                  ] as const
                ).map(([label, value], index) => (
                  <Fragment key={index}>
                    <Typography align="right">{label}</Typography>
                    {typeof value === 'boolean' ? (
                      <FluentCheckbox checked={value} />
                    ) : (
                      <Typography className={classes.value}>{value}</Typography>
                    )}
                    <div className={classes.spacer} />
                  </Fragment>
                ))}
              </div>
            ) : (
              <Skeleton width={700} height={90} />
            )}
          </Grid>

          <Grid item>
            {warehouses ? (
              <Paper elevation={0} className={classes.tableCard}>
                <Typography variant="h6" className={classes.tableCardTitle}>
                  Warehouses
                </Typography>
                <Table
                  rowData={warehouses || undefined}
                  suppressCellSelection={true}
                  domLayout="autoHeight"
                  autoSizeToFit={false}
                  colWidth={130}
                  columnDefs={[
                    {
                      field: 'warehouseCode',
                      headerName: 'Warehouse',
                      cellRenderer: 'linkRenderer',
                      cellRendererParams: {
                        getPath: ({ warehouseId }: StockWarehouseRecord) =>
                          `/Warehouse/${warehouseId}`,
                      },
                    },
                    { field: 'row', headerName: 'Row' },
                    { field: 'shelf', headerName: 'Shelf' },
                    { field: 'bin', headerName: 'Bin' },
                    { field: 'orderPoint', headerName: 'Order Point' },
                    { field: 'quantityInStock', headerName: 'In Stock' },
                    { field: 'reorderQuantity', headerName: 'Reorder' },
                    {
                      field: 'totalDollarValue',
                      headerName: 'Total Value',
                      type: 'rightAligned',
                      valueFormatter: ({ value }) => formatCurrency(value),
                    },
                    {
                      field: 'unitPrice',
                      headerName: 'Unit Price',
                      type: 'rightAligned',
                      valueFormatter: ({ value }) => formatCurrency(value),
                    },
                  ]}
                />
              </Paper>
            ) : (
              <Skeleton animation="wave" width={'100%'} height={140} />
            )}
          </Grid>

          <Grid item>
            {constructionUnits ? (
              <Paper elevation={0} className={classes.tableCard}>
                <Typography variant="h6" className={classes.tableCardTitle}>
                  Construction Units
                </Typography>
                <Table
                  rowData={constructionUnits}
                  suppressCellSelection={true}
                  domLayout="autoHeight"
                  autoSizeToFit={true}
                  columnDefs={[
                    { field: 'code', headerName: 'Code' },
                    { field: 'description', headerName: 'Description' },
                    {
                      field: 'unitType',
                      headerName: 'Unit Type',
                      maxWidth: 150,
                    },
                    {
                      field: 'cuStockCount',
                      headerName: 'Stock Count',
                      width: 100,
                    },
                  ]}
                />
              </Paper>
            ) : (
              <Skeleton animation="wave" width={'100%'} height={140} />
            )}
          </Grid>
        </Grid>
      ),
    },
    // {
    //   label: 'Transactions',
    //   actionsRow: [
    //     {
    //       id: 1,
    //       label: 'Create',
    //       click: () => setCreateTransactionOpen(true),
    //       component: AddIcon,
    //     },
    //   ],
    //   child: (
    //     <Table
    //       rowData={transactions}
    //       suppressCellSelection={true}
    //       domLayout="autoHeight"
    //       autoSizeToFit={true}
    //       columnDefs={[
    //         {
    //           field: 'documentDate',
    //           headerName: 'Date',
    //           valueFormatter: ({ value }) => formatDate(value),
    //         },
    //         { field: 'transactionType' },
    //         { field: 'quantity', maxWidth: 150 },
    //         {
    //           field: 'price',
    //           maxWidth: 150,
    //           valueFormatter: ({ value }) => formatCurrency(value),
    //         },
    //         {
    //           field: 'warehouseCode',
    //           headerName: 'Warehouse',
    //           cellRenderer: 'linkRenderer',
    //           cellRendererParams: {
    //             getPath: ({ warehouseId }: StockTransactionRecord) =>
    //               `/Warehouse/${warehouseId}`,
    //           },
    //         },
    //       ]}
    //     />
    //   ),
    // },
  ];

  return (
    <>
      {stock && (
        <CreateEditStock
          open={editOpen}
          close={closeSideSheet}
          current={stock}
        />
      )}

      {/* {stock && (
        <CreateStockTransaction
          open={createTransactionOpen}
          close={closeSideSheet}
          stock={stock}
        />
      )} */}

      {stock && (
        <ConfirmDelete
          open={deleteOpen}
          deleteItem={() => deleteMutation.mutateAsync(stock)}
          handleClose={(deleted: boolean) => {
            if (deleted) history.goBack();
            setDeleteOpen(false);
          }}
        />
      )}

      <SubHeaderAction>
        <PrimaryActionHeader
          title={stock?.description || null}
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
          handleChange={(event: any, tab: number) => setCurrentTab(tab)}
          value={currentTab}
          tabList={tabList}
          bottomRowSecondary={tabList[currentTab].actionsRow}
        />
      </SubHeaderAction>

      <OpenPage
        hasBottomActionRow={!!tabList[currentTab].actionsRow}
        disableGutters
      >
        <div className={classes.container}>{tabList[currentTab].child}</div>
      </OpenPage>
    </>
  );
};

export default StockView;
