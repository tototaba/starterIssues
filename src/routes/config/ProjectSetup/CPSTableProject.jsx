import React, { useState, useMemo, useCallback } from 'react';
import MaterialTable from 'material-table';
import {
  Paper,
  Tooltip,
  IconButton,
  makeStyles,
  // TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import ViewListIcon from '@material-ui/icons/ViewList';
import EditIcon from '@material-ui/icons/Edit';

import materialTableIcons from './materialTableIcons';

import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { archiveProject, restoreProject } from './CPSProject';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';


const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const TableContainer = props => (
  <Paper {...props} elevation={0} style={{ background: 'none' }} />
);

/**
 * Material table for projects
 */
const CPSTableProject = props => {
  const { projects, reloadRowData, viewArchived, reloadArchivedProjects } = props;
  /*const { formatDate } = useDateFormatters();*/
  const classes = useStyles();
  /* const { setProject } = useProjectActions(); */
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogOpenRestore, setConfirmationDialogOpenRestore] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [deleteProjectRow] = useMutation(archiveProject);
  const [restoreProjectRow] = useMutation(restoreProject);
  const { enqueueSnackbar } = useSnackbar();
  /* const can = useUserCan(); */
  /* const [isSystemAdmin, setIsSystemAdmin] = useState(Object.values(can).includes('systemAdmin')); */

  const openConfirmationDialog = useCallback(() => {
    setConfirmationDialogOpen(true);
  }, []);

  const closeConfirmationDialog = useCallback(() => {
    setConfirmationDialogOpen(false);
  }, []);

  const confirmDeleteProject = useCallback(
    row => {
      setSelectedRow(row);
      openConfirmationDialog();
      console.log(row.id)
    },
    [openConfirmationDialog]
  );

  const openConfirmationDialogRestore = useCallback(() => {
    setConfirmationDialogOpenRestore(true);
  }, []);

  const closeConfirmationDialogRestore = useCallback(() => {
    setConfirmationDialogOpenRestore(false);
  }, []);

  const confirmRestoreProject = useCallback(
    row => {
      setSelectedRow(row);
      openConfirmationDialogRestore();
    },
    [openConfirmationDialogRestore]
  );

  const deletingProject = useCallback(async () => {
    closeConfirmationDialog();
    const deletedProject = await deleteProjectRow({
      variables: {
        input: {},
        projectId: selectedRow?.id,
      },
    }).catch(res => {
      enqueueSnackbar(res.networkError.message, {
        variant: 'error',
      });
    });

    if (!deletedProject) {
      return;
    }
    await reloadRowData();
    await reloadArchivedProjects();

    enqueueSnackbar('Project successfully archived', {
      variant: 'success',
    });
  },
    [
      closeConfirmationDialog,
      deleteProjectRow,
      enqueueSnackbar,
      reloadRowData,
      selectedRow,
    ]
  );

  const restoringProject = useCallback(async () => {
    closeConfirmationDialogRestore();
    const project = await restoreProjectRow({
      variables: {
        input: {},
        projectId: selectedRow?.id,
      },
    }).catch(res => {
      enqueueSnackbar(res.networkError.message, {
        variant: 'error',
      });
    });

    if (!project) {
      return;
    }
    await reloadRowData();
    await reloadArchivedProjects();

    enqueueSnackbar('Project successfully restored', {
      variant: 'success',
    });
  },
    [
      restoreProjectRow,
      enqueueSnackbar,
      reloadRowData,
      selectedRow,
    ]
  );

  return (
    <div>
      <Dialog
        open={confirmationDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialog}>
          {'Archive Project?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to archive the following Project:{' '}
            {selectedRow?.name}?
              </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deletingProject} color="primary" autoFocus>
            Archive
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationDialogOpenRestore}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialog}>
          {'Restore Project?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to restore the following Project:{' '}
            {selectedRow?.name}?
              </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialogRestore} color="primary">
            Cancel
          </Button>
          <Button onClick={restoringProject} color="primary" autoFocus>
            Restore
          </Button>
        </DialogActions>
      </Dialog>
      <MaterialTable
        options={{
          paging: false
        }}
        components={{
          Container: TableContainer,
        }}
        icons={materialTableIcons}
        title=""
        columns={[
          { title: 'Project #', field: 'code', cellStyle: { width: '5%' } },
          {
            title: 'Project Short Code',
            field: 'acronym',
            cellStyle: { width: '5%' },
          },
          { title: 'Project Name', field: 'name', cellStyle: { width: '20%' } },
          { title: 'Address', field: 'address', cellStyle: { width: '25%' } },
          /* {
            title: 'Date Started',
            field: 'dateStarted',
            render: rowData =>
              rowData.dateStarted && formatDate(rowData.dateStarted),
          },
          {
            title: 'Date Completed',
            field: 'dateCompleted',
            render: rowData =>
              rowData.dateCompleted && formatDate(rowData.dateCompleted),
          }, */
          {
            title: 'Status',
            field: 'status',
            render: rowData => (rowData.status ? 'Started' : 'Completed'),
          },
          {
            title: 'Actions',
            field: 'actions',
            // eslint-disable-next-line react/display-name
            render: rowData => (
              <div className={classes.actions}>
                {/* <SideSheetOpener
                  button={
                    <Tooltip title="Update Project">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sheet={
                    {/* <ProjectSideSheet
                      reloadRowData={reloadRowData}
                      reloadArchivedProjects={reloadArchivedProjects}
                      type="update"
                      project={rowData}
                    />}
                  }
                /> */}
                {
                  viewArchived ?
                    <Tooltip title={"Restore Project"}>
                      <div>
                        <IconButton
                          onClick={() => confirmRestoreProject(rowData)}
                          /* disabled={!isSystemAdmin} */
                        >
                          <UnarchiveIcon />
                        </IconButton>
                      </div>
                    </Tooltip>
                    :
                    <Tooltip title={"Archive Project"}>
                      <div>
                        <IconButton
                          onClick={() => confirmDeleteProject(rowData)}
                          /* disabled={!isSystemAdmin} */
                        >
                          <ArchiveIcon />
                        </IconButton>
                      </div>
                    </Tooltip>
                }
              </div>
            ),
            disableClick: true,
            sorting: false,
          },
        ]}
        data={projects.map(group => ({
          ...group,
        }))}
        /* eslint-disable react/display-name */
        /* detailPanel={[
          {
            icon: props => <ViewListIcon {...props} />,
            tooltip: 'Project Summaries',
            render: rowData => (
              <ProjectSummaryCards projectId={rowData.id} view="table" />
            ),
          },
        ]} */
        /* eslint-enable react/display-name */
        onRowClick={(event, rowData) => {
          /* setProject(rowData.id); */
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'There are no Projects created',
          },
        }}
      />
    </div>
  );
};

/**
 * Material table for projects
 */
export default CPSTableProject;
