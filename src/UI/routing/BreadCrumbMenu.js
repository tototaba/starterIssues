import React from 'react';
import { Breadcrumbs, Typography, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Route } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: props =>
      props.color === 'primary'
        ? theme.palette.getContrastText(theme.palette.primary.main)
        : theme.palette.getContrastText(theme.palette.secondary.main),
  },
}));

const BreadCrumbMenu = props => {
  const classes = useStyles(props);
  const { root } = props;
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split('/').filter(x => x);
        return (
          <Breadcrumbs aria-label="Breadcrumb">
            <Link color="inherit" to="/" className={classes.link}>
              {root}
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return last ? (
                <Typography className={classes.link} key={to}>
                  {value}
                </Typography>
              ) : (
                <RouterLink to={to} key={to} className={classes.link}>
                  {value}
                </RouterLink>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
};

export default BreadCrumbMenu;
