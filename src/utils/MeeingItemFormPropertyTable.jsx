import React, { useState, useEffect, useCallback } from 'react';
import { AmbientGridTemplate, FluentCheckbox, AgTable } from 'unity-fluent-library';

const MeetingItemFormPropertyTable = props => {
  const {
    rows,
    handleMeetingItemPropertyChange,
    actionType,
    oldSeries,
  } = props;
  const [properties, setProperties] = useState({ data: rows });

  const handleChange = useCallback(
    (rowData, value, type) => {
      const newData = { ...rowData };
      newData[type] = value;

      const data = [...properties.data];
      data[data.indexOf(rowData)] = newData;
      const newProperties = { ...properties, data };

      setProperties(newProperties);

      handleMeetingItemPropertyChange(newProperties.data);
    },
    [handleMeetingItemPropertyChange, properties]
  );


  const CheckBoxRenderer = ({ onChange, value, id }) => {
    const handleCheckBoxcClick = () => {
      onChange(id);
    };

    return (
      <FluentCheckbox
        name={value}
        onChange={handleCheckBoxcClick}
      // className={}
      />
    );
  };

  const mockData = [{ property: "hello", id: "ten" }]

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
      { headerName: 'Property', field: 'property', editable: 'never' },
      {
        headerName: 'Visible',
        field: 'visible',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: (params) => ({
          onChange: () => { console.log("🚀 ~ file: MeetingItemFormPropertyTable.jsx:63 ~ MeetingItemFormPropertyTable ~ params.data.value:", params.data) },

          value: "params.data.gridViewVisibilityTypeId" // todo chagne to the propertie that needs to be dispalyed
        })
      },
      {
        headerName: 'Required',
        field: 'required',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: (params) => ({
          onChange: () => { console.log(params) },
          value: "params.data.gridViewVisibilityTypeId"
        })
      },
    ],
  };

  useEffect(() => {
    setProperties({ data: rows });
  }, [rows]);

  return (
    <AgTable
      gridOptions={gridOptions}
      rowData={mockData}
    />
  );
};
export default MeetingItemFormPropertyTable;
