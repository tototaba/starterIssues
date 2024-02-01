'use strict';

import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
} from 'react';
import { AgTable, AmbientGridTemplate } from 'unity-fluent-library';
const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', rowDrag: true },
        { field: 'country' },
        { field: 'year', width: 100 },
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            width: 170,
            sortable: true,
            filter: true,
        };
    }, []);

    const onGridReady = useCallback((params) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AmbientGridTemplate
                    data={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowDragManaged={true}
                    animateRows={true}
                    onGridReady={onGridReady}
                    disableRowSelection={true}
                />
            </div>
        </div>
    );
};
export default GridExample;