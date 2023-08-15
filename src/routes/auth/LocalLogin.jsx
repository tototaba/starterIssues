import React, { useState } from 'react';
import { LoginForm, useLocalUserActions } from 'unity-fluent-library';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import unityLogo from '../../assets/unitylogo.png';

const LocalLogin = props => {
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAccessToken } = useLocalUserActions();
  const history = useHistory();

  const onSubmit = async values => {
    setLoading(true);
    const response = await axios
      .request({
        method: 'post',
        url: `${process.env.REACT_APP_SECURITY_API_BASE}/authorization/login`, // Replace with url for local login
        data: values,
      })
      .catch(e => {
        setLoginError(true);
        setLoading(false);
      });
    if (response.status === 200) {
      setLoading(false);
      setAccessToken(response.data.accessToken);
      history.push('/');
    }
  };

  return (
    <LoginForm
      onSubmit={onSubmit}
      error={loginError}
      loading={loading}
      logo={unityLogo}
    />
  );
};

export default LocalLogin;
