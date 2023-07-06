import React, { forwardRef, useImperativeHandle } from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { DeleteIcon, EditIcon, ViewIcon } from '@fluentui/react-icons';
import { FluentIcon } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: 2,
    width: 32,
    height: 32,
  },
}));

export default forwardRef(function ActionsRenderer(
  { openViewPage, openEditPage, openDeletePage, data }: any,
  ref
) {
  const classes = useStyles();

  const onViewClicked = () => data && openViewPage(data);
  const onEditClicked = () => data && openEditPage(data);
  const onDeleteClicked = () => data && openDeletePage(data);

  const stopPropagation = (callback: any) => (ref: any) => {
    if (!ref) return;

    ref.onclick = (e: any) => {
      e.stopPropagation();
      callback();
    };
  };

  useImperativeHandle(ref, () => ({
    // Explicitly tell ag-grid that no special logic is needed on data change
    refresh: () => true,
  }));

  return data ? (
    <>
      {openViewPage && (
        <Tooltip title="View">
          <IconButton
            aria-label="View"
            className={classes.button}
            ref={stopPropagation(onViewClicked)}
          >
            <FluentIcon component={ViewIcon} size="medium" />
          </IconButton>
        </Tooltip>
      )}
      {openEditPage && (
        <Tooltip title="Edit">
          <IconButton
            aria-label="Edit"
            className={classes.button}
            ref={stopPropagation(onEditClicked)}
          >
            <FluentIcon component={EditIcon} size="medium" />
          </IconButton>
        </Tooltip>
      )}
      {openDeletePage && (
        <Tooltip title="Delete">
          <IconButton
            aria-label="Delete"
            className={classes.button}
            ref={stopPropagation(onDeleteClicked)}
          >
            <FluentIcon component={DeleteIcon} size="medium" />
          </IconButton>
        </Tooltip>
      )}
    </>
  ) : null;
});
