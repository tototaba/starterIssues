import React, { useState } from 'react';
import { Box, Chip, styled } from '@material-ui/core';
import { Stack } from '@mui/material';
import { ChipHeader } from "./ChipHeader"
import BreadcrumbTrail from './BreadCrumbTrail';
import MeetingControls from './MeetingControls';

const MeetingHeader = (props) => {
  const {
    meeting,
    chipData,
    crumbData,
    fetchMeeting,
    newBusiness,
  } = props;

  return (
    <Box sx={{ padding: "0 1em" }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        <BreadcrumbTrail items={crumbData} />
        <MeetingControls meeting={meeting} fetchMeeting={fetchMeeting} newBusiness={newBusiness} />
      </Box>
      <ChipHeader items={chipData} />
    </Box>
  );

}

export default MeetingHeader;