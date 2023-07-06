import axios from 'axios';
import { getAccessToken } from '../utils/apiHelpers';

/**
 * Extensions on Axios interfaces
 */
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    // Response interceptor adds pagination data
    pages: {
      prevPage: string | null;
      nextPage: string | null;
    };
  }
}

/**
 * Axios instance to use with the Fleet API
 */
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_WORK_MANAGEMENT_API_BASE,
});

/**
 * Add auth bearer token to requests
 */
axiosInstance.interceptors.request.use(async config => {
  const token = await getAccessToken();

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
});

/**
 * Extract pagination data from headers and add it to response
 */
axiosInstance.interceptors.response.use(response => {
  const prevPage = response.headers['x-prev'] || null;
  const nextPage = response.headers['x-next'] || null;

  response.pages = { nextPage, prevPage };

  return response;
});
