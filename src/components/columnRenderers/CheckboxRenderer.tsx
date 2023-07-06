import React, { forwardRef, useImperativeHandle } from 'react';
import { FluentCheckbox } from 'unity-fluent-library';

export default forwardRef(function CheckboxRenderer(
  { value }: { value: boolean | undefined },
  ref
) {
  useImperativeHandle(ref, () => ({
    // Explicitly tell ag-grid that no special logic is needed on data change
    refresh: () => true,
  }));

  return typeof value === 'boolean' ? <FluentCheckbox checked={value} /> : null;
});
