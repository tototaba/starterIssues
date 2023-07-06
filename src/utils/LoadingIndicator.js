import React from 'react';
import GridLoader from 'react-spinners/GridLoader';
import { corporateColors } from './brand';

const LoadingIndicator = ({ state = true }) => {
  const styleLoading = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={styleLoading}>
      <GridLoader size={30} color={corporateColors.teal} loading={state} />
    </div>
  );
};

export default LoadingIndicator;
