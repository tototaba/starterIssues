import React, { forwardRef } from 'react';

/**
 * @param props
 * @param ref
 * @returns
 */
const WorkOrderFinancialPage = (props: any, ref: any) => {
  const { params, ...other } = props;

  const id = params?.contentId;

  return (
    <>
      {/* <LocationInquiry
        id={locationId}
        isWidgetCard={true}
        refreshTree={refreshTree}
      /> */}
      <div>Work Order Financial Page ({id})</div>
    </>
  );
};

export default forwardRef(WorkOrderFinancialPage);
