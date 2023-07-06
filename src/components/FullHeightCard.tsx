import React from 'react';
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  lighten,
} from '@material-ui/core';
import { FluentButton, StatusChip, Adornment } from 'unity-fluent-library';

interface FullHeightCardProps {
  title?: string;
  button?: string;
  status?: string;
  label?: string;
  adornment?: string;
  onClick?: any;
  children: any;
}

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  // adornment: {
  //   borderLeft: `4px solid ${theme.palette.secondary.main}`
  // },
  // launchButton: {
  //   // position: (props) => !props.extendedContent && 'absolute',
  //   marginTop: theme.spacing(1),
  //   display: 'flex',
  //   justifyContent: 'flex-end',
  //   bottom: (props) => (props.adjustBaseline ? props.adjustBaseline : 16),
  //   right: 16,
  //   gridGap: 8
  // },
  moreButton: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: lighten(theme.palette.secondary.main, 0.9),
    padding: theme.spacing(1),
  },
  styleWidth: {
    width: '75%',
  },
  media: {
    height: 120,
  },
  // cardContent: {
  //   paddingTop: 0,
  //   padding: (props) => props.removePadding && 0,
  //   '&:last-child': {
  //     paddingBottom: (props) =>
  //       props.lastChildBottomPadding
  //         ? props.lastChildBottomPadding
  //         : theme.spacing(3)
  //   }
  // },
  titleWrapper: {
    display: 'flex',
  },
  title: {
    flex: 1,
    lineHeight: '125%',
  },
  // loading: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  // },
  // expandMessage: {
  //   display: 'flex',
  // },
  cardRoot: {
    '&:last-child': {
      paddingBottom: theme.spacing(10),
    },
  },
  // visualization: {
  //   display: 'flex',
  //   alignItems: 'flex-end',
  //   width: '100%',
  //   height: 300,
  // },
}));

const FullHeightCard = ({
  title,
  children,
  button,
  status,
  label,
  adornment,
  onClick,
}: FullHeightCardProps) => {
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {adornment && (
        <div style={{ height: '100%' }}>
          <Adornment color={adornment} />
        </div>
      )}

      <Card
        elevation={0}
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {title && (
          <CardContent
            className={classes.titleWrapper}
            classes={{ root: classes.cardRoot }}
          >
            <Typography className={classes.title} component="h2" variant={'h6'}>
              {title}
            </Typography>

            <StatusChip
              status={status}
              label={label}
              // success={overrideStatusSuccess}
              // error={overrideStatusError}
              // warning={overrideStatusWarning}
              // info={overrideStatusInfo}
            />
          </CardContent>
        )}

        <CardContent style={{ flex: 1 }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div style={{ flex: 1 }}>{children}</div>

            {button && (
              <div className={classes.moreButton}>
                <FluentButton
                  color="secondary"
                  variant="outlined"
                  onClick={onClick}
                >
                  {button}
                </FluentButton>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullHeightCard;
