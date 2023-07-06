// import React from 'react';

// import { addDecorator } from '@storybook/react';
// import { ThemeProvider } from '@material-ui/core/styles';

// import { muiTheme } from '../src/utils/theme';

// addDecorator(story => (
//   <ThemeProvider theme={muiTheme}>{story()}</ThemeProvider>
// ));

import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '../src/utils/theme';

addDecorator(story => (
  <ThemeProvider theme={ThemeProvider}>{story()}</ThemeProvider>
));

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
