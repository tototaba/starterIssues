import React from 'react';

import { getBudgets, deleteBudgetById } from '../../../api/client';
import { BudgetRecord } from '../../../api/models';
import { BasePage } from '../base';
import CreateEditBudget from './CreateEditBudget';

const Budget = () => {
  return (
    <BasePage<BudgetRecord>
      title="Budget"
      fetchPath="/budget"
      getData={getBudgets}
      deleteItem={({ id }) => deleteBudgetById(id)}
      createEditPage={CreateEditBudget}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'budgetNumber', headerName: 'Budget Number' },
        { field: 'description', headerName: 'Description' },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default Budget;
