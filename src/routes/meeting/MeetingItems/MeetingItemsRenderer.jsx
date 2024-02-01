import React from 'react';
import { Typography , makeStyles } from '@material-ui/core';
import { formatDate } from '../../../utils/formatDateHelpers';

const useStyles = makeStyles(theme => ({
    itemText:{
        wordBreak: 'normal'
    }
}));

function MeetingItemsRenderer({ data }) {
    if (!data) { 
        return (<div></div>) // return null triggers errorboundary.jsx but empty div does not
    } 
    function formatDate(date) {
        if (!date) return '';
        date = new Date(date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so +1 to get the correct month
        const year = date.getFullYear();

        return `${month}-${day}-${year}`;
    }
    const subject = data.subject || '';
    const description = data.description || '';
    const meetingActions = data.actionItems || [];
    const classes = useStyles();

    return (
        <div className={classes.itemText}>
            <Typography variant="subtitle1">
                {subject}
            </Typography>

            <Typography variant="body1" color="textSecondary">
                {description}
            </Typography>

            <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                {meetingActions.map((action, index) => (
                    <li key={index}>
                        <Typography>
                            <strong>{formatDate(action.action_date)}</strong>
                            {formatDate(action.action_date) != '' ? '-' : ''}
                            {action.action_taken}
                        </Typography>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default MeetingItemsRenderer;