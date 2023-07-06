import React from 'react';
import { useHistory } from 'react-router-dom';

import { getContractors, deleteContractorById } from '../../../api/client';
import { ContractorRecord } from '../../../api/models';
import formatPhoneNumber from '../../../utils/formatPhoneNumber';
import { BasePage } from '../base';
import CreateEditContractor from './CreateEditContractor';

const Contractor = () => {
  const history = useHistory();

  return (
    <BasePage<ContractorRecord>
      title="Contractors"
      fetchPath="/contractor"
      getData={getContractors}
      deleteItem={({ id }) => deleteContractorById(id)}
      createEditPage={CreateEditContractor}
      columnDefs={({ getActionsColumnDef }) => [
        { field: 'contractorName', headerName: 'Name' },
        { field: 'address1', headerName: 'Address 1' },
        { field: 'address2', headerName: 'Address 2' },
        {
          field: 'phone',
          headerName: 'Phone',
          valueFormatter: ({ value }) => formatPhoneNumber(value),
        },
        {
          field: 'fax',
          headerName: 'Fax',
          valueFormatter: ({ value }) => formatPhoneNumber(value),
        },
        {
          field: 'id',
          ...getActionsColumnDef({
            rendererParams: {
              openViewPage: ({ id }: ContractorRecord) =>
                history.push(`/contractor/${id}`),
            },
            width: 155,
          }),
        },
      ]}
    />
  );
};

export default Contractor;
