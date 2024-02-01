import React from 'react';
import { FluentCheckbox } from 'unity-fluent-library'; // Import your UI library

const CheckBoxRenderer = ({ defaultChecked, id, option, updateMetaData }) => {
  const handleCheckBoxClick = () => {
    updateMetaData(id, option, !defaultChecked);
  };

  return (
    <div className="checkbox-container">
      <FluentCheckbox
        defaultChecked={defaultChecked}
        onChange={handleCheckBoxClick}
      />
    </div>
  );
};

export default CheckBoxRenderer;
