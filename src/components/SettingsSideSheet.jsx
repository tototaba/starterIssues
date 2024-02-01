import React, { useCallback, useState, useEffect } from 'react';
import { SideSheet, FluentButton, useOutlook, useHandleAxiosSnackbar } from 'unity-fluent-library';
import { Typography, Box, Link, CircularProgress } from '@material-ui/core';
import OutlookIcon from '@material-ui/icons/Email'; // or a custom Outlook icon



const SettingsSideSheet = ({ isOpen, onClose, isLoading }) => {
    const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
    const { getAccessToken, invalidateUserSession, login, isUserSignedIn } = useOutlook(process.env.REACT_APP_MINUTES_URL + "/callback", onLoginFinished);
    const [isSignedIn, setIsSignedIn] = useState();
    useEffect(() => {
        getAccessToken();
        setIsSignedIn(isUserSignedIn());
    }, [isOpen]);

    const handleSignOut = async () => {
        invalidateUserSession();
        setIsSignedIn(false);
        onClose();
        handleSuccessSnackbar('Successfully signed out from Outlook')
    };

    const handleConnect = () => {
        login()
    }

    function onLoginFinished() {
        setIsSignedIn(true);
        handleSuccessSnackbar('Successfully connected to Outlook');
    }


    return (
        <SideSheet open={isOpen} onClose={onClose}>
            <Box padding={2}>
                <Typography variant="h6" gutterBottom>
                    {isSignedIn ? 'Outlook Account' : 'Connect to Outlook'}
                </Typography>

                {isSignedIn ? (
                    <>
                        <Typography variant="body1" gutterBottom>
                            You are currently signed in to Outlook. Do you want to sign out?
                        </Typography>
                        <Box textAlign="center" marginY={2}>
                            <OutlookIcon style={{ fontSize: 40, color: '#0072C6' }} />
                        </Box>
                        <FluentButton
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </FluentButton>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Link your account to Outlook to manage your emails directly from our app.
                        </Typography>
                        <Box textAlign="center" marginY={2}>
                            <OutlookIcon style={{ fontSize: 40, color: '#0072C6' }} />
                        </Box>
                        <FluentButton
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleConnect}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : null}
                        >
                            {isLoading ? 'Connecting...' : 'Connect to Outlook'}
                        </FluentButton>
                    </>
                )}

                <FluentButton
                    variant="outlined"
                    color="default"
                    fullWidth
                    onClick={onClose}
                    style={{ marginTop: '10px' }}
                >
                    Cancel
                </FluentButton>

                <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
                    By signing in you are giving <b>Meeting Minutes</b> access to your calendar.
                    {isSignedIn && ' You can sign out at any time.'}
                </Typography>
            </Box>
        </SideSheet>
    );
};

export default SettingsSideSheet;
