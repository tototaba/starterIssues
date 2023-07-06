import React, { forwardRef } from 'react';

/**
 * @param props
 * @param ref
 * @returns
 */
const EstimateSummaryPage = (props: any, ref: any) => {
  const { params, ...other } = props;

  const id = params?.contentId;

  return (
    <>
      {/* <LocationInquiry
        id={locationId}
        isWidgetCard={true}
        refreshTree={refreshTree}
      /> */}
      <div>Estimate Summary Page ({id})</div>
    </>
  );
};

export default forwardRef(EstimateSummaryPage);
