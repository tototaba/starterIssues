import React, { useMemo } from 'react';
import { AxiosResponse } from 'axios';
import { QueryKey } from 'react-query';

import { useFleetQuery } from '../../api/query';
import Picker, { BasePickerProps } from './Picker';

export interface BaseDataPickerProps<IDType, RecordType>
  extends Omit<BasePickerProps<IDType>, 'setValue' | 'value'> {
  value: IDType | IDType[];
  setValue: (value: IDType, item: RecordType) => void;
}

// TODO: fix value typing
export interface DataPickerProps<IDType, RecordType>
  extends BaseDataPickerProps<IDType, RecordType> {
  queryKey: QueryKey;
  queryFetcher: (params: {
    [key: string]: any;
  }) => Promise<AxiosResponse<RecordType[]>>;
  itemLabel: keyof RecordType | ((item: RecordType) => string);
  itemValue:
    | keyof RecordType
    | (keyof RecordType)[]
    | ((item: RecordType) => IDType | IDType[]);
  filterData?: (data: RecordType[]) => RecordType[];
}

const DataPicker = <RecordType, IDType>(
  props: DataPickerProps<IDType, RecordType>
) => {
  const {
    error,
    helperText,
    setValue,
    queryKey,
    queryFetcher,
    itemLabel,
    itemValue,
    value,
    filterData,
    ...rest
  } = props;

  const { result: data, error: fetchError } = useFleetQuery(
    queryKey,
    queryFetcher
  );

  const filteredData = useMemo(
    () => (data && filterData ? filterData(data) : data),
    [filterData, data]
  );

  const getItemLabel = (item: RecordType) =>
    typeof itemLabel === 'function'
      ? itemLabel(item)
      : (item[itemLabel] as unknown as string);

  const getItemValue = (item: RecordType): IDType | string => {
    if (typeof itemValue === 'function') {
      const valueOrValues = itemValue(item);

      return Array.isArray(valueOrValues)
        ? valueOrValues.join('|')
        : valueOrValues;
    } else {
      return Array.isArray(itemValue)
        ? itemValue.map(key => item[key]).join('|')
        : (item[itemValue] as unknown as IDType);
    }
  };

  return (
    <Picker
      options={
        filteredData?.map(item => ({
          label: getItemLabel(item),
          value: getItemValue(item) as any,
        })) ?? []
      }
      fullWidth
      {...rest}
      value={Array.isArray(value) ? (value.join('|') as any) : value}
      setValue={(value: IDType) => {
        const item = data?.find(item => getItemValue(item) === value);

        if (item) {
          setValue(value, item);
        }
      }}
      error={!!fetchError || error}
      helperText={
        (fetchError && 'Error: Unable to load the data.') || helperText
      }
    />
  );
};

export default DataPicker;
