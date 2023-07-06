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

export interface ConstructionUnitsViewProps<RecordType>
  extends Pick<
  BasePageProps<RecordType>,
  'getData' | 'deleteItem' | 'renderSubHeaderActions'
  > {
  name: string;
  fetchPath: string;
  createEditPage: React.ComponentType<CreateEditPageProps<RecordType>>;
}

const MeetingItemView = <
  RecordType extends AssemblyRecord | SubassemblyRecord
>({
  name,
  fetchPath,
  getData,
  deleteItem,
  createEditPage,
  renderSubHeaderActions,
}: ConstructionUnitsViewProps<RecordType>) => {
  return (
    <BasePage<RecordType>
      title={name}
      fetchPath={fetchPath}
      getData={getData}
      deleteItem={deleteItem}
      createEditPage={createEditPage}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'code', headerName: '#' },
        { field: 'description', headerName: 'Item' },
        { field: 'listCode', headerName: 'Due Date' },
        { field: 'listCode', headerName: 'Priority' },
        { field: 'listCode', headerName: 'Draft Sent' },
        { field: 'listCode', headerName: 'Final Sent' },
        { field: 'listCode', headerName: 'Actions' },
        /* { field: 'id', ...getActionsColumnDef() }, */
      ]}
      renderSubHeaderActions={renderSubHeaderActions}
    />
  );
};

export default MeetingItemView;
