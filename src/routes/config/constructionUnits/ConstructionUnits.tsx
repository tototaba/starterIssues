import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PrimaryActionHeader } from 'unity-fluent-library';

import {
  getAssemblies,
  getSubassemblies,
  deleteAssemblyById,
  deleteSubassemblyById,
} from '../../../api/client';
import { mockRowData } from '../../../mockData/mockData';
import { AssemblyRecord, SubassemblyRecord } from '../../../api/models';
import ConstructionUnitsView, {
  ConstructionUnitsViewProps,
} from './ConstructionUnitsView';
import {
  CreateEditAssembly,
  CreateEditSubassembly,
} from './CreateEditConstructionUnits';
import { AddIcon } from '@fluentui/react-icons';

const ConstructionUnits = () => {
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const tab = searchParams.get('tab') || 'assembly';

    return tab === 'subassembly' ? 1 : 0;
  });

  const onTabChange = (event: any, newValue: number) => {
    const searchParams = new URLSearchParams(history.location.search);

    searchParams.delete('page');
    searchParams.delete('rowsPerPage');
    searchParams.set('tab', newValue === 1 ? 'subassembly' : 'assembly');

    history.push({
      search: searchParams.toString(),
    });

    setSelectedTab(newValue);
  };

  const renderSubHeaderActions: ConstructionUnitsViewProps<any>['renderSubHeaderActions'] =
    ({ openCreatePage }) => (
      <PrimaryActionHeader
        title="Meeting Series"
        buttonLabel="New Meeting"
        handleClick={openCreatePage}
        icon={<AddIcon style={{ fontSize: 16 }} />}
        /* tabList={[{ label: 'Current Projects' }, { label: 'Archived Projects' }]} */
        value={selectedTab}
        handleChange={onTabChange}
      />
    );
  return selectedTab === 0 ? (
    <ConstructionUnitsView<AssemblyRecord>
      name="Active Projects"
      fetchPath="/assembly"
      getData={getAssemblies}
      deleteItem={({ id }) => deleteAssemblyById(id)}
      createEditPage={CreateEditAssembly}
      renderSubHeaderActions={renderSubHeaderActions}
    />
  ) : (
    <ConstructionUnitsView<SubassemblyRecord>
      name="Subassembly"
      fetchPath="/subassembly"
      getData={getSubassemblies}
      deleteItem={({ id }) => deleteSubassemblyById(id)}
      createEditPage={CreateEditSubassembly}
      renderSubHeaderActions={renderSubHeaderActions}
    />
  );
};

export default ConstructionUnits;
