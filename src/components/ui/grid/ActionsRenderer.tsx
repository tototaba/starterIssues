import React, { useCallback } from 'react';
import { makeStyles, alpha, Divider, Typography } from '@material-ui/core';
import {
  AscendingIcon,
  DescendingIcon,
  AssignIcon,
  ContactIcon,
  ChromeCloseIcon,
  EditIcon,
} from '@fluentui/react-icons';
import { IconButtonWithTooltip } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  icon: {
    margin: theme.spacing(0.5),
  },
  iconActiveAsc: {
    margin: theme.spacing(0.5),
    color: theme.palette.secondary.main,
    background: alpha(theme.palette.secondary.main, 0.1),
  },
  iconActiveDesc: {
    margin: theme.spacing(0.5),
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.1),
  },
  orderedText: {
    color: 'grey',
    fontSize: 10,
    paddingTop: 10,
  },
}));

/**
 * ActionsRenderer
 */
const ActionsRenderer: React.FC<any> = props => {
  const { handleDelete, handleEdit, handleSort, handleManageObservers, handleUpdateItemForm, data } = props;
  const classes = useStyles();

  const handleSortAction = useCallback(
    () => handleSort(data),
    [data, handleSort]
  );

  const handleDeleteAction = useCallback(
    () => handleDelete(data),
    [data, handleDelete]
  );
  
  const handleEditAction = useCallback(
    () => handleEdit(data),
    [data, handleDelete]
  );

  const handleManageObserversAction = useCallback(
    () => handleManageObservers(data),
    [data. handleManageObservers]
  );
  
  const handleUpdateItemFormAction = useCallback(
    () => handleUpdateItemForm(data),
    [data, handleUpdateItemForm]
  );

  const ActionItem = (props: {
    icon: any;
    title: any;
    clickOption: any;
    disabled: any;
    className: any;
  }) => {
    const { icon, title, clickOption, disabled, className } = props;

    return (
      <IconButtonWithTooltip
        icon={icon}
        title={title}
        aria-label={title}
        className={className || classes.icon}
        size="small"
        onClick={clickOption}
        disabled={disabled}
        fluentIconClassName={'idk'}
      />
    );
  };

  let ActionList = [
    {
      title: 'Edit',
      icon: EditIcon,
      clickOption: handleEditAction,
      visible: handleEdit ? true : false,
      disabled: false,
      className: classes.icon,
    },
    {
      title: 'Delete',
      icon: ChromeCloseIcon,
      clickOption: handleDeleteAction,
      visible: handleDelete ? true : false,
      disabled: false,
      className: classes.icon,
    },
    {
      title: 'Manage Meeting Observers',
      icon: ContactIcon,
      clickOption: handleManageObserversAction,
      visible: handleManageObservers ? true : false,
      disabled: false,
      className: classes.icon,
    },
    {
      title: 'Update Item Form',
      icon: AssignIcon,
      clickOption: handleUpdateItemFormAction,
      visible: handleUpdateItemForm ? true : false,
      disabled: false,
      className: classes.icon,
    }
  ];

  ActionList = ActionList.filter(action => action.visible);

  const displayActions = ActionList.map(item => {
    return (
      <ActionItem
        key={item.title}
        title={item.title}
        icon={item.icon}
        clickOption={item.clickOption}
        disabled={item.disabled}
        className={item.className}
      />
    );
  });

  return (
    <div className={classes.root}>
      {data?.columnAttributes?.ordered && (
        <Typography className={classes.orderedText} variant="caption">
          {data?.columnAttributes?.ordered}
        </Typography>
      )}
      {data?.extendedProperties?.orderable && (
        <ActionItem
          key="Sort"
          title="Sort"
          icon={
            data?.columnAttributes?.ordered === 'DESC'
              ? DescendingIcon
              : AscendingIcon
          }
          clickOption={handleSortAction}
          disabled={false}
          className={
            data?.columnAttributes?.ordered === 'DESC'
              ? classes.iconActiveDesc
              : data?.columnAttributes?.ordered === 'ASC'
              ? classes.iconActiveAsc
              : classes.icon
          }
        />
      )}
      {data?.extendedProperties?.orderable && (
        <Divider orientation="vertical" flexItem />
      )}
      {displayActions}
    </div>
  );
};

export default ActionsRenderer;
