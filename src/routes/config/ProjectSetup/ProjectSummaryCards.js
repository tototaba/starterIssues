import React from 'react';
import { makeStyles } from '@material-ui/core';
import MeetingSummaryCard from '../meetingOverview/cards/meetingCards/MeetingSummaryCard';
import SubmittalSummaryCard from '../submittals/SubmittalSummaryCard';
import RfiSummaryCard from '../rfi/RfiSummaryCard';
import SiSummaryCard from '../sis/SiSummaryCard';
import { useQuery } from '@apollo/client';
import { listProjectSummary } from '../utils/api/graphql/Project';
import LoadingSpinner from '../ui/LoadingSpinner';
import LoadingProgressBar from '../ui/LoadingProgressBar';

const useStyles = makeStyles(theme => ({
  summaryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: `0 ${-theme.spacing(1)}px`,
    '& > *': {
      flex: '1 1',
      margin: `0 ${theme.spacing(1)}px`,
      marginBottom: theme.spacing(2),
    },
    marginTop: theme.spacing(2),
  },
}));

const ProjectSummaryCards = props => {
  const { summary, projectId, view } = props;
  const classes = useStyles();

  const { data } = useQuery(listProjectSummary, {
    variables: { projectId: projectId },
    skip: view !== 'table',
  });

  const tableSummary = data?.listProjectSummary;

  const projectSummary = view === 'summary' ? summary : tableSummary;

  if (!projectSummary) {
    if (view === 'summary') {
      return <LoadingSpinner size={64} />;
    } else if (view === 'table') {
      return <LoadingProgressBar />;
    }
  }

  return (
    <div className={classes.summaryContainer}>
      <SubmittalSummaryCard summary={projectSummary.submittals} view={view} />
      <SiSummaryCard summary={projectSummary.sis} view={view} />
      <RfiSummaryCard summary={projectSummary.rfis} view={view} />
      {/* <MeetingSummaryCard summary={projectSummary.minutes} view={view} /> */}
    </div>
  );
};

export default ProjectSummaryCards;
