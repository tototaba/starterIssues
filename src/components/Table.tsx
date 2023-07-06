import React, { useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { AgGridReactProps } from '@ag-grid-community/react';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import {
  GridApi,
  // ColumnApi,
  ColDef,
  ColGroupDef,
  GridReadyEvent,
} from '@ag-grid-community/core';
import { AgTable } from 'unity-fluent-library';

import {
  ActionsRenderer,
  CheckboxRenderer,
  LinkRenderer,
} from './columnRenderers';

export interface TableProps<DataType> extends AgGridReactProps {
  rowData?: DataType[];
  height?: any;
  autoSizeToFit?: boolean;
  columnDefs?: ((ColDef & { field?: keyof DataType }) | ColGroupDef)[];
  onGridReady?: (event: GridReadyEvent) => void;
}

const useStyles = makeStyles(() => ({
  tableContainer: {
    '& > .ag-theme-material': {
      height: '100%',
    },
    '& .ag-row': {
      animation: '$fadein 150ms ease-in 2ms backwards',
    },
    '& .ag-cell-inline-editing': {
      padding: '5px 2px',
      height: 46,
      background: 'none',
      boxShadow: 'none',
      border: 'none !important',
    },
    // TODO: figure out how to move down overlapping horizontal scroll bar
    // '& .ag-body-viewport.ag-layout-auto-height': {
    //   paddingBottom: 8,
    // },
    '& .ag-cell, & .ag-full-width-row .ag-cell-wrapper.ag-row-group': {
      lineHeight: '41px',
    },
    '& .ag-row-editing': {
      zIndex: 1,
      boxShadow: '0 0 8px #ccc',
    },
    '& .ag-floating-filter-input .ag-text-field-input': {
      paddingBottom: '0 !important',
    },
  },
  '@keyframes fadein': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));

const Table = <DataType,>({
  rowData,
  autoSizeToFit = true,
  height,
  domLayout,
  onGridReady,
  ...rest
}: TableProps<DataType>) => {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  const gridApi = useRef<GridApi>();
  // const columnApi = useRef<ColumnApi>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoSizeToFit && container.current) {
      // TODO: fix typescript version !!
      const observer = new (window as any).ResizeObserver(() => {
        gridApi.current?.sizeColumnsToFit();
      });

      observer.observe(container.current);

      return () => observer.disconnect();
    }
  }, [autoSizeToFit]);

  const mainOnGridReady = useCallback(
    (params: any) => {
      if (autoSizeToFit) params.api.sizeColumnsToFit();

      setTimeout(() => setVisible(true), 0);

      gridApi.current = params.api;
      // columnApi.current = params.columnApi;

      if (onGridReady) {
        onGridReady(params);
      }
    },
    [autoSizeToFit, onGridReady]
  );

  const styles: any = {
    maxWidth: '100%',
    visibility: visible ? 'visible' : 'hidden',
  };

  if (domLayout !== 'autoHeight') styles.height = height || '75vh';
  else if (height) styles.maxHeight = height;

  return (
    <div ref={container} className={classes.tableContainer} style={styles}>
      <AgTable
        modules={[InfiniteRowModelModule]}
        rowHeight={44}
        headerHeight={46}
        floatingFiltersHeight={46}
        onGridReady={mainOnGridReady}
        rowData={rowData}
        {...rest}
        frameworkComponents={{
          actionsRenderer: ActionsRenderer,
          checkboxRenderer: CheckboxRenderer,
          linkRenderer: LinkRenderer,
          ...(rest.frameworkComponents || {}),
        }}
        defaultColDef={{
          resizable: true,
          ...(rest.defaultColDef || {}),
        }}
        domLayout={domLayout}
      />
    </div>
  );
};

export default Table;
