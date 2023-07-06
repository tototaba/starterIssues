import React from 'react';
import { Typography } from '@material-ui/core';
import { TimeLine as UnityTimeline } from 'unity-fluent-library';
import { EventRecord } from '../api/models';

interface EventTimelineProps {
  events: EventRecord[] | undefined;
}

const EventTimeline = ({ events }: EventTimelineProps) => {
  return events && events.length ? (
    <UnityTimeline
      semantic
      biasLeft
      timelineData={events
        .map(({ eventDate, eventType, eventSummary }) => ({
          type: eventType,
          title: eventType,
          event: eventSummary,
          time: eventDate,
        }))
        .reverse()}
    />
  ) : (
    <Typography variant="body1">No events to show.</Typography>
  );
};

export default EventTimeline;
