import Axios from 'axios';
import { getAccessToken, getMergedConfig } from './apiHelpers';

export default () => {
  Axios.interceptors.request.use(
    async config => {
      const accessToken = await getAccessToken().catch(err => {
        // TODO: ensure this is actually removed if an
        // access token could not be retrieved.
        localStorage.removeItem('unityRefreshTokenExp');
      });

      if (accessToken) {
        const mergedConfig = getMergedConfig(accessToken, config);
        return mergedConfig;
      }

      return config;
    },
    error => Promise.reject(error)
  );

  Axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error?.config;
      if (error?.response?.status === 401 && !config?._retry) {
        config.headers.Authorization = `Bearer ${await getAccessToken()}`;
        config._retry = true;
        await getAccessToken();

        return Axios(config);
      }

      return Promise.reject(error);
    }
  );
};
