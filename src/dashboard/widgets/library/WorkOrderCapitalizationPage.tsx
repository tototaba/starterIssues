import React, { forwardRef } from 'react';

/**
 * @param props
 * @param ref
 * @returns
 */
const WorkOrderCapitalizationPage = (props: any, ref: any) => {
  const { params, ...other } = props;

  const id = params?.contentId;

  return (
    <>
      {/* <LocationInquiry
        id={locationId}
        isWidgetCard={true}
        refreshTree={refreshTree}
      /> */}
      <div>Work Order Capitalization Page ({id})</div>
    </>
  );
};

export default forwardRef(WorkOrderCapitalizationPage);
