import { makeStyles } from '@material-ui/core';
import React, { useState, useMemo, ComponentType } from 'react';
import { AgGridReactProps } from '@ag-grid-community/react';
import {
  RowClickedEvent,
  ColDef,
  ColGroupDef,
  GridApi,
} from '@ag-grid-community/core';
import { AxiosResponse } from 'axios';
import {
  OpenPage,
  SubHeaderAction,
  PrimaryActionHeader,
  // useGridFormat,
  // useGridClear,
  // useQuickFilter,
} from 'unity-fluent-library';
import { AddIcon } from '@fluentui/react-icons';
// import { useHistory } from 'react-router-dom';

import { QueryParams } from '../../../api/client';
import { useFleetMutation } from '../../../api/query';
import Table from '../../../components/Table';
import ConfirmDelete from '../../../components/ConfirmDelete';
// import Pagination from '../../../components/Pagination';

export interface CreateEditPageProps<RecordType> {
  open: boolean;
  current?: RecordType;
  viewOnly?: boolean;
  close: (updated?: boolean) => void;
}

export interface BasePageProps<RecordType> {
  // Enable config
  enableCreate?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;

  // Display Strings
  title: string;

  // Data configuraiton
  fetchPath: string;
  getData: (params: QueryParams) => Promise<AxiosResponse<RecordType[]>>;
  deleteItem?: (item: RecordType) => Promise<AxiosResponse<void>>;
  filterData?: (data: RecordType[]) => RecordType[];

  // UI Configuration
  columnDefs: (helpers: {
    getActionsColumnDef: ReturnType<typeof makeGetActionsColumnDef>;
  }) => ((ColDef & { field?: keyof RecordType }) | ColGroupDef)[]; // AgGridReactProps['columnDefs']
  defaultColDef?: AgGridReactProps['defaultColDef'];
  createEditPage: ComponentType<CreateEditPageProps<RecordType>>;
  renderSubHeaderActions?: (params: {
    title: string;
    openCreatePage: () => void;
  }) => void;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: theme.spacing(1),
  },
  contentContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: 'white',
  },
}));

const makeGetActionsColumnDef =
  <RecordType,>({
    enableEdit,
    enableDelete,
    setItemToEdit,
    setItemToDelete,
  }: {
    enableEdit: boolean;
    enableDelete: boolean;
    setItemToEdit: (val: RecordType | null) => void;
    setItemToDelete: (val: RecordType | null) => void;
  }) =>
  ({
    rendererParams = {},
    width = 120,
  }: {
    rendererParams?: any;
    width?: number;
  } = {}) =>
    ({
      headerName: '',
      type: 'rightAligned',
      suppressMovable: true,
      suppressSizeToFit: true,
      width,
      minWidth: width,
      filter: false,
      resizable: false,
      cellRenderer: 'actionsRenderer',
      cellRendererParams: {
        openEditPage: enableEdit
          ? (data: RecordType) => setItemToEdit(data)
          : null,
        openDeletePage: enableDelete
          ? (data: RecordType) => setItemToDelete(data)
          : null,
        ...(rendererParams || {}),
      },
    } as const);

export const BasePage = <RecordType,>({
  enableCreate = true,
  enableEdit = true,
  enableDelete = true,
  title,
  fetchPath,
  getData,
  deleteItem,
  filterData,
  columnDefs,
  createEditPage: CreateEditPage,
  renderSubHeaderActions = undefined,
  defaultColDef = undefined,
}: BasePageProps<RecordType>) => {
  const classes = useStyles();
  // const history = useHistory();
  // const searchParams = useMemo(() => {
  //   const params = new URLSearchParams(history.location.search);
  //   const page = params.get('page');
  //   const rowsPerPage = params.get('rowsPerPage');

  //   return {
  //     page: (page && Math.max(0, parseInt(page, 10) - 1)) || 0,
  //     rowsPerPage: (rowsPerPage && parseInt(rowsPerPage, 10)) || 10,
  //   };
  // }, [history]);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  // const [page, setPage] = useState(searchParams.page);
  // const [rowsPerPage, setRowsPerPage] = useState(searchParams.rowsPerPage);
  const [createViewOpen, setCreateViewOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RecordType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RecordType | null>(null);

  const deleteMutation = useFleetMutation((item: RecordType) =>
    deleteItem!(item)
  );

  const dataSource = useMemo(
    () => ({
      getRows: ({
        startRow,
        endRow,
        filterModel,
        successCallback,
        failCallback,
      }: any) => {
        const queryParams = Object.entries<any>(filterModel).reduce<any>(
          (params, [key, { filter }]) => {
            // take the last part of a field name / key
            // ex. assetFindaEquipment.modelId => modelId
            const parts = key.toLowerCase().split('.');
            params[parts[parts.length - 1]] = filter;
            return params;
          },
          {}
        );

        getData({
          ...queryParams,
          page: startRow / 10 + 1,
          limit: endRow - startRow,
        })
          .then(response => {
            successCallback(
              response.data,
              response.pages.nextPage ? -1 : startRow + response.data.length
            );
          })
          .catch(error => {
            failCallback();
          });
      },
    }),
    [getData]
  );

  // const paginationParams = { limit: rowsPerPage, page: page + 1 };
  // const {
  //   result: preData,
  //   pages,
  //   error,
  //   refetch,
  //   isFetching,
  //   isPreviousData,
  // } = useFleetQuery(
  //   [fetchPath, paginationParams],
  //   () => getData(paginationParams),
  //   { keepPreviousData: true, enabled: false }
  // );

  // const data = useMemo(
  //   () => (preData && filterData ? filterData(preData) : preData),
  //   [preData, filterData]
  // );

  // useEffect(() => {
  //   const params = new URLSearchParams(history.location.search);

  //   if (page > 0) params.set('page', (page + 1).toString());
  //   else params.delete('page');

  //   if (rowsPerPage !== 10) params.set('rowsPerPage', rowsPerPage.toString());
  //   else params.delete('rowsPerPage');

  //   history.push({
  //     search: params.toString(),
  //   });
  // }, [history, page, rowsPerPage]);

  const openCreatePage = () => {
    if (enableCreate) {
      setCreateViewOpen(true);
    }
  };

  const closeSideSheet = (updated = false) => {
    setCreateViewOpen(false);
    setItemToEdit(null);
    if (updated && gridApi) gridApi.refreshInfiniteCache();
  };

  const onRowClicked = (event: RowClickedEvent) => {
    if (enableEdit) {
      setItemToEdit(event.data);
    }
  };

  // const [gridFormat] = useGridFormat();
  // const [gridClear] = useGridClear();
  // const [quickFilter] = useQuickFilter();

  // if (error) {
  //   return <div>ERROR: An error occurred while loading the data.</div>;
  // }

  return (
    <OpenPage disableGutters>
      <SubHeaderAction>
        {renderSubHeaderActions ? (
          renderSubHeaderActions({ title, openCreatePage })
        ) : (
          <PrimaryActionHeader
            title={title}
            // subheader="Hub for issues and enhancements"
            {...(enableCreate
              ? {
                  buttonLabel: 'Create',
                  handleClick: openCreatePage,
                  icon: <AddIcon style={{ fontSize: 16 }} />,
                }
              : {
                  hidePAB: true,
                })}
            // grid
            // expandOptions={expandOptions}
            // expandOptions
            // expandAllItems={() => gridFormat(gridApi, 'expand')}
            // collapse={() => gridFormat(gridApi, 'collapse')}
            // resizeGrid={() => gridFormat(gridApi, 'resize')}
            // group={openGroup}
            // secondaryButtons={secondaryButtons}
            // search
            // expandOptions={expandOptions}
            // handleMouseLeave={() => setExpandOptions(false)}
            // expandedContent={
            //   <SimpleGroupOptions
            //     groupSubject={item => setGrouped([...grouped, item])}
            //   />
            // }
            // searchField={
            //   <FluentTextField
            //     id="outlined-size-small"
            //     variant="outlined"
            //     size="small"
            //     onChange={handleFilterChange}
            //     fullWidth
            //     style={{ marginTop: -20 }}
            //     InputProps={{
            //       startAdornment: (
            //         <InputAdornment position="start">
            //           <SearchIcon />
            //         </InputAdornment>
            //       ),
            //     }}
            //   />
            // }
            // handleChange={handleChange}
            // value={value}
            // data={columnDefs}
            // tabList={tabList}
            // hidePAB
          />
        )}
      </SubHeaderAction>

      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <Table<RecordType>
            key={fetchPath}
            onGridReady={({ api }) => setGridApi(api)}
            suppressCellSelection={true}
            suppressRowClickSelection={true}
            rowSelection="single"
            animateRows={true}
            onRowClicked={onRowClicked}
            rowModelType="infinite"
            cacheBlockSize={10}
            // height="100%"
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            infiniteInitialRowCount={1}
            datasource={dataSource}
            defaultColDef={{
              filter: 'agTextColumnFilter',
              floatingFilter: true,
              floatingFilterComponentParams: {
                suppressFilterButton: true,
                debounceMs: 300,
              },
              resizable: true,
              ...(defaultColDef || {}),
            }}
            columnDefs={columnDefs({
              getActionsColumnDef: makeGetActionsColumnDef({
                enableEdit,
                enableDelete,
                setItemToEdit,
                setItemToDelete,
              }),
            })}
          />
          {/* <Pagination
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            hasNextPage={!!pages?.nextPage}
            isFetching={isFetching}
            isPreviousData={isPreviousData}
          /> */}
        </div>
      </div>

      {enableCreate && (
        <CreateEditPage open={createViewOpen} close={closeSideSheet} />
      )}

      {enableEdit && (
        <CreateEditPage
          open={itemToEdit !== null}
          close={closeSideSheet}
          current={itemToEdit || undefined}
        />
      )}

      {enableDelete && deleteItem && (
        <ConfirmDelete
          open={itemToDelete !== null}
          deleteItem={() => deleteMutation.mutateAsync(itemToDelete!)}
          handleClose={(deleted: boolean) => {
            if (deleted && gridApi) {
              gridApi.refreshInfiniteCache();
            }
            setItemToDelete(null);
          }}
        />
      )}
    </OpenPage>
  );
};

export default BasePage;
