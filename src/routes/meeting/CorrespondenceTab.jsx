import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import {
  FluentTabPanel,
  PrimaryActionHeader,
  useAxiosGet,
} from 'unity-fluent-library';
import MinutesCorrespondence from './MinutesCorrespondence';

const CorrespondenceTab = (props) => {
  const {
    meeting,
    attendees,
  } = props;
  const [tabValue, setTabValue] = useState(0);
  const tabList = [{ label: 'DRAFT MINUTES CORRESPONDENCE' }, { label: 'FINAL MINUTES CORRESPONDENCE' }];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [{ data: correspondence }, refetchCorrespondence] = useAxiosGet(
    process.env.REACT_APP_MEETING_MINUTES_API_BASE,
    `cpsmeeting_attachment/meeting/${meeting?.id ?? ''}`,
    {},
    !!!meeting
  );

  useEffect(() => {
    if (meeting) {
      refetchCorrespondence();
    }
  }, [meeting, tabValue]);

  return (
    <Box>
      <Box margin={'1rem'}>
        <PrimaryActionHeader
          tabs
          tabList={tabList}
          handleChange={handleTabChange}
          value={tabValue}
          hidePAB
        />
        <FluentTabPanel value={tabValue} index={0}>
          <MinutesCorrespondence
            meeting={meeting}
            attendees={attendees}
            correspondence={correspondence}
            refetchCorrespondence={refetchCorrespondence}
            type='Review'
            isDraft={true}
          />
        </FluentTabPanel>
        <FluentTabPanel value={tabValue} index={1}>
          <MinutesCorrespondence
            meeting={meeting}
            attendees={attendees}
            correspondence={correspondence}
            refetchCorrespondence={refetchCorrespondence}
            type='Minutes'
            isDraft={false}
          />
        </FluentTabPanel>

      </Box>

    </Box>
  );
};

export default CorrespondenceTab;
