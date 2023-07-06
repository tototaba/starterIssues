import React from 'react';

import { getUnitOfMeasures } from '../../api/client';
import { UnitOfMeasureRecord } from '../../api/models';
import DataPicker, { BaseDataPickerProps } from './DataPicker';

const UnitOfMeasurePicker = ({
  ...props
}: BaseDataPickerProps<number, UnitOfMeasureRecord>) => (
  <DataPicker
    {...props}
    queryKey={['/unitofmeasure', { limit: 100 }]}
    queryFetcher={() => getUnitOfMeasures({ limit: 100 })}
    itemLabel="unitOfMeasure"
    itemValue="id"
  />
);

export default UnitOfMeasurePicker;
