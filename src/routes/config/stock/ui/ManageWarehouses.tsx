import React, { useState } from 'react';
import { InputAdornment, Typography, Grid } from '@material-ui/core';
import { AddIcon, DeleteIcon } from '@fluentui/react-icons';
import { useFormikContext, FieldArray } from 'formik';
import { FluentIconButton, AmbientCard } from 'unity-fluent-library';

import { StockWarehouseRecord } from '../../../../api/models';
import WarehouseSearchModal from '../../../../components/search/WarehouseSearchModal';
import { FormikTextField } from '../../../../components/fields/TextField';

const ManageWarehouses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    values: { stockWarehouses: _stockWarehouses },
  } = useFormikContext();

  const stockWarehouses = _stockWarehouses as Partial<StockWarehouseRecord>[];

  const commonTextFieldProps = {
    margin: 'dense',
    fullWidth: true,
  } as const;

  return (
    <FieldArray name="stockWarehouses">
      {arrayHelpers => (
        <>
          <Grid container item xs alignItems="center">
            <Typography variant="h6">Warehouses</Typography>
          </Grid>
          <Grid item>
            <FluentIconButton
              onClick={() => setModalOpen(true)}
              icon={AddIcon}
            />
          </Grid>

          {stockWarehouses.map((stockWarehouse, index: number) => {
            const id = stockWarehouse.id;
            const fieldPrefix = `stockWarehouses[${index}].`;

            return (
              <Grid key={id} item xs={12}>
                <AmbientCard
                  title={stockWarehouse.warehouseCode}
                  fullWidth
                  header
                >
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    {/* Only stockWarehouses added on the frontend (not sent to server yet) can be removed */}
                    {(stockWarehouse as any).wasAdded && (
                      <FluentIconButton
                        onClick={() => arrayHelpers.remove(index)}
                        icon={DeleteIcon}
                      />
                    )}
                  </div>
                  <Grid container spacing={1}>
                    <Grid
                      container
                      item
                      xs={12}
                      spacing={1}
                      alignItems="center"
                    >
                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Row"
                          name={fieldPrefix + 'row'}
                          // required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Shelf"
                          name={fieldPrefix + 'shelf'}
                          // required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Bin"
                          name={fieldPrefix + 'bin'}
                          // required
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Order Point"
                          name={fieldPrefix + 'orderPoint'}
                          type="number" // todo: this is a number
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Reorder Qty."
                          name={fieldPrefix + 'reorderQuantity'}
                          type="number" // todo: this is a number
                          required
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Qty. In Stock"
                          name={fieldPrefix + 'quantityInStock'}
                          type="number"
                          disabled
                          // required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Total Dollar Value"
                          name={fieldPrefix + 'totalDollarValue'}
                          type="number"
                          // required
                          disabled
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormikTextField
                          {...commonTextFieldProps}
                          label="Unit Price"
                          name={fieldPrefix + 'unitPrice'}
                          type="number"
                          // required
                          disabled
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </AmbientCard>
              </Grid>
            );
          })}

          <WarehouseSearchModal
            open={modalOpen}
            exclude={stockWarehouses
              .map(stockWarehouse => stockWarehouse.warehouseId)
              .filter((x): x is number => !!x)}
            handleClose={(selected, selectedData = {}) => {
              if (selected && selected.length) {
                for (const warehouse of Object.values(selectedData)) {
                  arrayHelpers.push({
                    // stockId: number,
                    wasAdded: true,
                    warehouseId: warehouse.id,
                    warehouseCode: warehouse.warehouseCode,
                    unitPrice: 0,
                    totalDollarValue: 0,
                    row: '',
                    shelf: '',
                    bin: '',
                    orderPoint: 0,
                    reorderQuantity: 0,
                    quantityInStock: 0,
                  });
                }
              }
              setModalOpen(false);
            }}
          />
        </>
      )}
    </FieldArray>
  );
};

export default ManageWarehouses;
