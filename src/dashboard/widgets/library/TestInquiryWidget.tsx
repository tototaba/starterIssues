import React, { forwardRef } from 'react';
import { WidgetCard } from 'unity-fluent-library';

/**
 * Add a page as child of <WidgetCard> component.
 * Leave {children} as a child of <WidgetCard> as it is required for all props to pass through.
 * @param props
 * @param ref
 * @returns
 */
const TestInquiryWidget = (props: any, ref: any) => {
  const { children, params, ...other } = props;

  const id = params?.contentId;

  return (
    <WidgetCard
      ref={ref}
      title={'Location Inquiry'}
      theme={'light'}
      hideWidgetName={params?.hideWidgetName}
      innerPadding={'0'}
      contentMaxHeight={
        params?.heightOffset
          ? `calc(100vh - ${140 + params?.heightOffset}px)`
          : 'calc(100vh - 140px)'
      }
      {...other}
    >
      {/* <LocationInquiry
        id={locationId}
        isWidgetCard={true}
        refreshTree={refreshTree}
      /> */}
      <div>{id}</div>
      {children}
    </WidgetCard>
  );
};

export default forwardRef(TestInquiryWidget);
