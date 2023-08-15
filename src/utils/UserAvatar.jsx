import { Avatar, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import useDevicePixelRatio from '../utils/useDevicePixelRatio';
import useGravatar from '../utils/useGravatar';

const useStyles = makeStyles(
  theme => ({
    root: {},
    default: {},
    toolbar: {
      width: 32,
      height: 32,
    },
    large: {
      width: 80,
      height: 80,
    },
  }),
  { name: 'UserAvatar' }
);

/**
 * Inteligent user Avatar element
 *
 * - Loads a Gravatar based on the email if one exists
 * - Falls back to a text avatar while loading and when a Gravatar does not exist
 * - Automatically chooses image size based on size prop and device pixel density (and updates if device pixel density changes)
 */
const UserAvatar = props => {
  const classes = useStyles(props);
  const { name, email, size = 'default', className, ...other } = props;
  const dppx = useDevicePixelRatio();
  const dimension = { toolbar: 32, large: 80 }[size] || 40;
  const avatar = useGravatar(email, { size: dimension * dppx });

  return (
    <Avatar
      alt={name}
      aria-label={`${name}'s avatar`}
      {...other}
      className={clsx(className, classes[size])}
      src={avatar}
    >
      {name?.trim()?.charAt(0) || '?'}
    </Avatar>
  );
};

export default UserAvatar;
