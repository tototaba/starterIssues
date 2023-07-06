import React from 'react';

import { getConstructionUnits } from '../../api/client';
import { CommonAssemblyRecord } from '../../api/models';
import DataPicker, { BaseDataPickerProps } from './DataPicker';

const ConstructionUnitPicker = (
  props: BaseDataPickerProps<number, CommonAssemblyRecord>
) => (
  <DataPicker
    {...props}
    queryKey={['/constructionunits', { limit: 100 }]}
    queryFetcher={() => getConstructionUnits({ limit: 100 })}
    itemLabel="code"
    itemValue="id"
  />
);

export default ConstructionUnitPicker;
