import React, { useState } from 'react';
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
import { mockGridOptions, mockRowData } from '../../mockData/mockData';
import {
  CRMServicesIcon,
  ReportDocumentIcon,
  DeveloperToolsIcon,
} from '@fluentui/react-icons';

const TestPage = () => {
  const { gridApi, onGridReady } = useAgGridApi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

  return (
    <OpenPage
      maxWidth="xl"
      disableGutters={false}
      style={{
        background: 'rgb(244, 244, 244)',
        position: 'relative',
        top: 0,
      }}
    >
      <FluentDialog
        title={'Dialog'}
        message={'Message content within the Dialog'}
        labelOne={'Acknowledge'}
        actionOne={() => setDialogOpen(false)}
        labelTwo={'Cancel'}
        actionTwo={() => setDialogOpen(false)}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
      <SideSheet
        key={'sideSheet'}
        title={'Side Sheet'}
        width={500}
        buttonLabel={'Button'}
        open={sideSheetOpen}
        onClose={() => setSideSheetOpen(false)}
        children={
          <AmbientCard fullWidth={true} title={'Field Grouping'}>
            <FluentTextField id={'textField'} label={'Text Field'} />
          </AmbientCard>
        }
      />
      <AmbientCard fullWidth={true}>
        <AgTable
          gridOptions={mockGridOptions}
          rowData={mockRowData}
          api={gridApi}
          onGridReady={onGridReady}
          dynamicSizing
        />
      </AmbientCard>
      <SubHeaderAction>
        <PrimaryActionHeader
          title={'Home Page'}
          subheader={'Home page for the Work Management'}
          buttonLabel={'Open Side Sheet'}
          handleClick={() => setSideSheetOpen(true)}
          secondaryButtons={[
            {
              label: '',
              component: CRMServicesIcon,
              click: () => setDialogOpen(true),
            },
            {
              label: '',
              component: ReportDocumentIcon,
              click: () => setDialogOpen(true),
            },
            {
              label: '',
              component: DeveloperToolsIcon,
              click: () => setDialogOpen(true),
            },
          ]}
          search
          seachField={FluentSearchField}
        />
      </SubHeaderAction>
    </OpenPage>
  );
};
export default TestPage;
