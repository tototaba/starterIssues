import React, { useState, useEffect, useCallback } from 'react';
import { AmbientGridTemplate, FluentCheckbox, AgTable } from 'unity-fluent-library';
import CheckBoxRenderer from '../../components/ui/grid/CheckboxRenderer';
import { Switch } from '@material-ui/core';

const AttendeesGrid = props => {
  const {
    rows,
    setAttendeesMetaData,
    attendeesMetaData,
  } = props;

  const [check, setCheck] = useState(false);

  const updateMetaData = useCallback((id, option, value) => {
    setAttendeesMetaData(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [option]: value,
      },
    }));
    console.log(attendeesMetaData);
  }, [setAttendeesMetaData]);

  const gridOptions = {
    frameworkComponents: {
      checkBoxRenderer: CheckBoxRenderer,
      checkBoxRenderer: CheckBoxRenderer,
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      { headerName: 'Name', field: 'name', editable: 'never' },
      {
        headerName: 'Send Review',
        field: 'required',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked: attendeesMetaData[params.data.id].send_review,
          option: 'send_review',
          id: params.data.id,
          updateMetaData,
        }),
      },
      {
        headerName: 'Send Minutes',
        field: 'attended',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked: attendeesMetaData[params.data.id].send_minutes,
          // checked: check,
          option: 'send_minutes',
          id: params.data.id,
          updateMetaData,
        }),
      },
    ],
  };

  return (
    <>
      <AgTable
        gridOptions={gridOptions}
        rowData={rows}
        loading={false}
      />
    </>
  );
};
export default AttendeesGrid;
