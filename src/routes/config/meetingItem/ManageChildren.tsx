import React, { useState, SetStateAction, Dispatch } from 'react';
import { Grid, Typography, makeStyles, Theme } from '@material-ui/core';
import { AddIcon, DeleteIcon } from '@fluentui/react-icons';
import { useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik';
import { FluentIconButton, AmbientCard } from 'unity-fluent-library';

import {
  AssemblyChildRecord,
  SubassemblyChildRecord,
} from '../../../api/models';
import SubassemblySearchModal from '../../../components/search/SubassemblySearchModal';
import StockSearchModal from '../../../components/search/StockSearchModal';
import { FormikTextField } from '../../../components/fields/TextField';

interface ManageChildrenProps<RecordType> {
  title: string;
  countFieldName: string;
  getRowId: (child: RecordType) => number;
  getRowTitle: (child: RecordType) => string;
  renderSearchModal: (params: {
    children: RecordType[];
    arrayHelpers: FieldArrayRenderProps;
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  padRight: {
    paddingRight: theme.spacing(2),
  },
}));

export const ManageChildren = <RecordType,>({
  title,
  countFieldName,
  getRowId,
  getRowTitle,
  renderSearchModal,
}: ManageChildrenProps<RecordType>) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    values: { children: _children },
  } = useFormikContext();

  const children = _children as RecordType[];

  return (
    <FieldArray name="children">
      {arrayHelpers => (
        <>
          <Grid item xs={12}>
            <AmbientCard title={title} fullWidth header>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <FluentIconButton
                  onClick={() => setModalOpen(true)}
                  icon={AddIcon}
                />
              </div>
              <Grid container item spacing={1}>
                {children.length === 0 && (
                  <Grid item xs={12} style={{ marginTop: 8 }}>
                    <Typography>
                      No {title.toLowerCase()} to show. Try adding one!
                    </Typography>
                  </Grid>
                )}
                {children.map((child, index: number) => {
                  const fieldPrefix = `children[${index}].`;

                  return (
                    <Grid
                      key={getRowId(child)}
                      container
                      item
                      xs={12}
                      alignItems="center"
                    >
                      <Grid item xs className={classes.padRight}>
                        {getRowTitle(child)}
                      </Grid>
                      <Grid item className={classes.padRight} xs={4}>
                        <FormikTextField
                          type="number"
                          // TODO: this needs to be changed in the UI library
                          style={{ marginTop: -8 }}
                          InputProps={{ inputProps: { step: 'any', min: 1 } }}
                          placeholder="Enter count"
                          name={fieldPrefix + countFieldName}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item>
                        <FluentIconButton
                          onClick={() => arrayHelpers.remove(index)}
                          icon={DeleteIcon}
                        />
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </AmbientCard>
          </Grid>
          {renderSearchModal({
            arrayHelpers,
            modalOpen,
            setModalOpen,
            children,
          })}
        </>
      )}
    </FieldArray>
  );
};

export const ManageAssemblyChildren = () => {
  return (
    <ManageChildren<AssemblyChildRecord>
      title="Test"
      countFieldName="subassemblyCount"
      getRowId={child => child.id}
      getRowTitle={child =>
        `${child.subassemblyCode} - ${child.subassemblyDescription}`
      }
      renderSearchModal={({
        arrayHelpers,
        modalOpen,
        setModalOpen,
        children,
      }) => (
        <SubassemblySearchModal
          open={modalOpen}
          exclude={children
            .map(child => child.subassemblyId)
            .filter((x): x is number => !!x)}
          handleClose={(selected, selectedData = {}) => {
            if (selected && selected.length) {
              for (const subassembly of Object.values(selectedData)) {
                arrayHelpers.push({
                  subassemblyId: subassembly.id,
                  subassemblyCode: subassembly.code,
                  subassemblyDescription: subassembly.description,
                  subassemblyCount: 1,
                });
              }
            }
            setModalOpen(false);
          }}
        />
      )}
    />
  );
};

export const ManageSubassemblyChildren = () => {
  return (
    <ManageChildren<SubassemblyChildRecord>
      title="Stock"
      countFieldName="stockCount"
      getRowId={child => child.id}
      getRowTitle={child => `${child.stockNumber} - ${child.stockDescription}`}
      renderSearchModal={({
        arrayHelpers,
        modalOpen,
        setModalOpen,
        children,
      }) => (
        <StockSearchModal
          mode="multiple"
          open={modalOpen}
          exclude={children
            .map(child => child.stockId)
            .filter((x): x is number => !!x)}
          handleClose={selectedStock => {
            if (selectedStock?.length) {
              for (const stock of selectedStock) {
                arrayHelpers.push({
                  stockId: stock.id,
                  stockNumber: stock.stockNumber,
                  stockDescription: stock.description,
                  stockCount: 1,
                });
              }
            }
            setModalOpen(false);
          }}
        />
      )}
    />
  );
};
