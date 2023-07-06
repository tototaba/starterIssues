import React from 'react';

import { getEmployees } from '../../api/client';
import { EmployeeRecord } from '../../api/models';
import DataPicker, { BaseDataPickerProps } from './DataPicker';

const EmployeePicker = (props: BaseDataPickerProps<number, EmployeeRecord>) => (
  <DataPicker
    {...props}
    queryKey={['/employee', { limit: 100 }]}
    queryFetcher={() => getEmployees({ limit: 100 })}
    itemLabel={({ employeeCode, firstName, lastName }) =>
      `${firstName} ${lastName} (${employeeCode})`
    }
    itemValue="id"
  />
);

export default EmployeePicker;
