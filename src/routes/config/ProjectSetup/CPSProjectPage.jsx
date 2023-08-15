import React, { useState, memo } from 'react';
/* import useProjectCreateAction from './useProjectCreateAction'; */
import { usePageHeader } from './HeaderContext';
import HeaderAlignment from './HeaderAlignment';
import CPSTableProject from './CPSTableProject';
import { useQuery } from '@apollo/client';
import { listProjects, listArchiveProjects } from './CPSProject';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  buttons: {
    display: 'flex',
    marginTop: 30
  },
}));

/**
 * Request for information dashboard route
 */
let CPSProjectPage = props => {
  /* useProjectCreateAction(); */

  const classes = useStyles();
  const [viewArchived, setViewArchived] = useState(false);
  const [viewButton, setViewButton] = useState("View Archived Projects");
  const projectsData = useQuery(listProjects);
  const projects = projectsData?.data?.listProjects;
  const archiveProjectsData = useQuery(listArchiveProjects);
  const archiveProjects = archiveProjectsData?.data?.listArchiveProjects;

  const reloadProjects = projectsData?.refetch;
  const reloadArchivedProjects = archiveProjectsData?.refetch;

  function toggleProjects() {
    viewArchived ? setViewArchived(false) : setViewArchived(true);
    viewArchived ? setViewButton("View Archived Projects") : setViewButton("View Active Projects");
  };

  usePageHeader(sticky => sticky && <HeaderAlignment leftInset={48} />);

  if (!projects) {
    return null;
  }

  return (
    <div>
      <div className={classes.buttons}>
        <Button
          variant="outlined"
          size="large"
          disabled={false}
          onClick={toggleProjects}
        >
          {viewButton}
        </Button>
      </div>
      {/* { viewArchived ? */}
         {/* <CPSTableProject projects={archiveProjects} reloadRowData={reloadProjects} viewArchived={viewArchived} reloadArchivedProjects={reloadArchivedProjects} /> : */}
        {/* // <CPSTableProject projects={projects} reloadRowData={reloadProjects} viewArchived={viewArchived} reloadArchivedProjects={reloadArchivedProjects} /> */}
    </div>
  )
};
CPSProjectPage = memo(CPSProjectPage);

export default CPSProjectPage;
