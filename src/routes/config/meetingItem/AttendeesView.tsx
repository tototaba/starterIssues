import React from 'react';
import {
  OpenPage,
  PrimaryActionHeader,
  SubHeaderAction,
  SideSheet,
  AmbientCard,
  FluentSearchField,
  FluentTextField,
  FluentDialog,
  AgTable,
  useAgGridApi,
} from 'unity-fluent-library';

import { AssemblyRecord, SubassemblyRecord } from '../../../api/models';
import { BasePage, BasePageProps, CreateEditPageProps } from '../base';
import { mockGridOptions, mockRowData } from '../../../mockData/mockData';

export interface AttendeesUnitsViewProps<RecordType>
  extends Pick<
  BasePageProps<RecordType>,
  'getData' | 'deleteItem' | 'renderSubHeaderActions'
  > {
  name: string;
  fetchPath: string;
  createEditPage: React.ComponentType<CreateEditPageProps<RecordType>>;
}

const AttendeesView = <
  RecordType extends AssemblyRecord | SubassemblyRecord
>({
  name,
  fetchPath,
  getData,
  deleteItem,
  createEditPage,
  renderSubHeaderActions,
}: AttendeesUnitsViewProps<RecordType>) => {
  return (
    <BasePage<RecordType>
      title={name}
      fetchPath={fetchPath}
      getData={getData}
      deleteItem={deleteItem}
      createEditPage={createEditPage}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'code', headerName: 'Name' },
        { field: 'description', headerName: 'Type' },
        { field: 'listCode', headerName: 'Company' },
        { field: 'listCode', headerName: 'Send Review' },
        { field: 'listCode', headerName: 'Send Minues' },
        { field: 'listCode', headerName: 'Minutes Taker' },
        { field: 'listCode', headerName: 'Attended' },
        { field: 'listCode', headerName: 'Actions' },
        /* { field: 'id', ...getActionsColumnDef() }, */
      ]}
      renderSubHeaderActions={renderSubHeaderActions}
    />
  );
};

export default AttendeesView;
