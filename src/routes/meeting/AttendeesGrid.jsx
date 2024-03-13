import React, { useState, useEffect, useCallback } from 'react';
import {
  AmbientGridTemplate,
  FluentCheckbox,
  AgTable,
} from 'unity-fluent-library';
import CheckBoxRenderer from '../../components/ui/grid/CheckboxRenderer';
import { Switch } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const AttendeesGrid = props => {
  const { rows, setAttendeesMetaData, attendeesMetaData } = props;
  const { t } = useTranslation();

  const updateMetaData = useCallback(
    (id, option, value) => {
      setAttendeesMetaData(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          [option]: value,
        },
      }));
    },
    [setAttendeesMetaData]
  );

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
      { headerName: t('Name'), field: 'name', editable: 'never' },
      {
        headerName: t('Send Review'),
        field: 'required',
        width: '140px',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked:
            attendeesMetaData[params?.data?.attendee_id]?.send_review,
          option: 'send_review',
          id: params?.data?.attendee_id,
          updateMetaData,
        }),
      },
      {
        headerName: t('Send Minutes'),
        field: 'sendminutes',
        width: '140px',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked:
            attendeesMetaData[params?.data?.attendee_id]?.send_minutes,
          option: 'send_minutes',
          id: params?.data?.attendee_id,
          updateMetaData,
        }),
      },
      {
        headerName: t('Attended'),
        field: 'attended',
        width: '140px',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked:
            attendeesMetaData[params?.data?.attendee_id]?.attended,
          option: 'attended',
          id: params?.data?.attendee_id,
          updateMetaData,
        }),
      },
      {
        headerName: t('Minutes Taker'),
        field: 'prepared_by',
        width: '150px',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: params => ({
          defaultChecked:
            attendeesMetaData[params?.data?.attendee_id]?.prepared_by,
          option: 'prepared_by',
          id: params?.data?.attendee_id,
          updateMetaData,
        }),
      },
    ],
  };

  return (
    <>
      <AgTable gridOptions={gridOptions} rowData={rows} loading={false} />
    </>
  );
};
export default AttendeesGrid;
