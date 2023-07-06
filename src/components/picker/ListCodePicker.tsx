import React from 'react';

import { getListCodes } from '../../api/client';
import { ListCodeRecord } from '../../api/models';
import DataPicker, { BaseDataPickerProps } from './DataPicker';

const ListCodePicker = (props: BaseDataPickerProps<string, ListCodeRecord>) => (
  <DataPicker
    {...props}
    queryKey={['/listcode', { limit: 100 }]}
    queryFetcher={() => getListCodes({ limit: 100 })}
    itemLabel={({ listCode, listCodeDescription }) =>
      `${listCode} - ${listCodeDescription}`
    }
    itemValue="listCode"
  />
);

export default ListCodePicker;
