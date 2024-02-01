import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    AmbientGridTemplate,
    ActionsRenderer,
    PrimaryActionButton,
    apiMutate,
    useAgGridApi,
    useUser,
    SubHeaderAction,
    PrimaryActionHeader,
    FluentTabPanel,
    useAxiosGet,
} from 'unity-fluent-library';
import {
    AssignIcon,
    ContactIcon,
    EditIcon,
    AddIcon,
} from '@fluentui/react-icons';
import { useHistory } from 'react-router-dom';
import CreateMeetingSideSheet from '../meeting/CreateMeetingSideSheet';
import MyMeetingsGrid from './MyMeetingsGrid';
import MyMeetingItemsGrid from './MyMeetingItemsGrid';
import { Typography, Box } from '@material-ui/core';

const DashBoard = () => {
    const [tabValue, setTabValue] = useState(0);

    const user = useUser();
    const tabList = [
        {
            label: 'My Meetings',
        },
        {
            label: 'My Meeting Items',
        },
    ];

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    return (
        <>
            <Box>
                <SubHeaderAction>
                    <PrimaryActionHeader
                        title="Dashboard"
                        tabs
                        tabList={tabList}
                        handleChange={handleTabChange}
                        value={tabValue}
                        hidePAB={true}
                    />
                </SubHeaderAction>
                <FluentTabPanel value={tabValue} index={0}>
                    <MyMeetingsGrid></MyMeetingsGrid>
                </FluentTabPanel>
                <FluentTabPanel value={tabValue} index={1}>
                    <MyMeetingItemsGrid></MyMeetingItemsGrid>
                </FluentTabPanel>
                <FluentTabPanel value={tabValue} index={2}>

                </FluentTabPanel>
            </Box >
        </>

    );
};

export default DashBoard;
