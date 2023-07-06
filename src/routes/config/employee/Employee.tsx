import React from 'react';

import { getEmployees, deleteEmployeeById } from '../../../api/client';
import { EmployeeRecord } from '../../../api/models';
import formatCurrency from '../../../utils/formatCurrency';
import { BasePage } from '../base';
import CreateEditEmployee from './CreateEditEmployee';

const Employee = () => {
  return (
    <BasePage<EmployeeRecord>
      title="Employee"
      fetchPath="/employee"
      getData={getEmployees}
      deleteItem={({ id }) => deleteEmployeeById(id)}
      createEditPage={CreateEditEmployee}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'employeeCode' },
        { field: 'firstName' },
        { field: 'lastName' },
        { field: 'emailAddress' },
        {
          field: 'regularRate',
          type: 'rightAligned',
          valueFormatter: ({ value }) => formatCurrency(value),
        },
        {
          field: 'overtimeRate',
          type: 'rightAligned',
          valueFormatter: ({ value }) => formatCurrency(value),
        },
        { field: 'id', ...getActionsColumnDef() },
      ]}
    />
  );
};

export default Employee;
