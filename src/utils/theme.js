import {
  CssBaseline,
  MuiThemeProvider,
  lighten,
  // light,
  // darken,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

import React, { useMemo, useState } from 'react';
import {
  verticalPrimary,
  verticalSecondary,
  useTypeScale,
  greyScale,
} from 'unity-fluent-library';

/**
 * Custom MUI theme provider
 */
export const ThemeProvider = ({ children }) => {
  const [
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    body1,
    body2,
    subtitle1,
    subtitle2,
    button,
    caption,
    overline,
  ] = useTypeScale();
  const [currentTheme, setCurrentTheme] = useState('');

  const theme = useMemo(() => {
    const { augmentColor } = createTheme().palette;

    const primary = verticalPrimary(currentTheme?.toLowerCase());
    const secondary = verticalSecondary(currentTheme?.toLowerCase());

    const coreTheme = createTheme({
      palette: {
        type: 'light',
        primary: {
          main: primary,
          light: lighten(primary, 0.8),
        },
        secondary: {
          main: secondary,
        },
        appBar: augmentColor({
          main: '#021b38',
        }),
        background: {
          default: greyScale('light'),
          footer: '#021b38',
        },
      },
      dimensions: {
        drawerWidth: 200,
      },
      typography: {
        fontFamily: [
          // Webfont
          // System font stack
          // '-apple-system',
          // 'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Noto',
          'Helvetica Neue',
          'Helvetica',
          'Ubuntu',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ]
          .map(item => (item.includes(' ') ? `"${item}"` : item))
          .join(', '),
      },
      mixins: {
        toolbar: {
          minHeight: 48,
          padding: 0,
        },
      },
      props: {
        MuiTextField: {
          margin: 'normal',
          variant: 'filled',
          fullWidth: true,
        },
      },
    });

    const fullTheme = createTheme({
      ...coreTheme,
      overrides: {
        MuiCssBaseline: {
          '@global': {
            '*::-webkit-scrollbar': {
              height: 8,
              width: 8,
              backgroundColor: '#fff',
            },
            '*::-webkit-scrollbar-track': {
              backgroundColor: '#fff',
            },
            '*::-webkit-scrollbar-track:hover': {
              backgroundColor: '#f4f4f4',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: '#babac0',
              borderRadius: 16,
              border: '2px solid #fff',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#a0a0a5',
              border: '2px solid #f4f4f4',
            },
          },
        },
        MuiTypography: {
          h1: {
            fontSize: h1.size,
            fontWeight: h1.weight,
            lineHeight: h1.lineHeight,
            letterSpacing: h1.letterSpacing,
          },
          h2: {
            fontSize: h2.size,
            fontWeight: h2.weight,
            lineHeight: h2.lineHeight,
            letterSpacing: h2.letterSpacing,
          },
          h3: {
            fontSize: h3.size,
            fontWeight: h3.weight,
            lineHeight: h3.lineHeight,
            letterSpacing: h3.letterSpacing,
          },
          h4: {
            fontSize: h4.size,
            fontWeight: h4.weight,
            lineHeight: h4.lineHeight,
            letterSpacing: h4.letterSpacing,
          },

          h5: {
            fontSize: h5.size,
            fontWeight: h5.weight,
            lineHeight: h5.lineHeight,
            letterSpacing: h5.letterSpacing,
          },
          h6: {
            fontSize: h6.size,
            fontWeight: h6.weight,
            lineHeight: h6.lineHeight,
            letterSpacing: h6.letterSpacing,
          },
          subtitle1: {
            fontSize: subtitle1.size,
            fontWeight: subtitle1.weight,
            lineHeight: subtitle1.lineHeight,
            letterSpacing: subtitle1.letterSpacing,
          },
          subtitle2: {
            fontSize: subtitle2.size,
            fontWeight: subtitle2.weight,
            lineHeight: subtitle2.lineHeight,
            letterSpacing: subtitle2.letterSpacing,
          },
          body1: {
            fontSize: body1.size,
            fontWeight: body1.weight,
            lineHeight: body1.lineHeight,
            letterSpacing: body1.letterSpacing,
          },
          body2: {
            fontSize: body2.size,
            fontWeight: body2.weight,
            lineHeight: body2.lineHeight,
            letterSpacing: body2.letterSpacing,
          },
          button: {
            fontSize: button.size,
            fontWeight: button.weight,
            lineHeight: button.lineHeight,
            letterSpacing: button.letterSpacing,
          },
          caption: {
            fontSize: caption.size,
            fontWeight: caption.weight,
            lineHeight: caption.lineHeight,
            letterSpacing: caption.letterSpacing,
          },
          overline: {
            fontSize: overline.size,
            fontWeight: overline.weight,
            lineHeight: overline.lineHeight,
            letterSpacing: overline.letterSpacing,
          },
        },
      },
    });
    return {
      ...fullTheme,
      setCurrentTheme,
      isInitialized: currentTheme !== '',
    };
  }, [
    body1.letterSpacing,
    body1.lineHeight,
    body1.size,
    body1.weight,
    body2.letterSpacing,
    body2.lineHeight,
    body2.size,
    body2.weight,
    button.letterSpacing,
    button.lineHeight,
    button.size,
    button.weight,
    caption.letterSpacing,
    caption.lineHeight,
    caption.size,
    caption.weight,
    h1.letterSpacing,
    h1.lineHeight,
    h1.size,
    h1.weight,
    h2.letterSpacing,
    h2.lineHeight,
    h2.size,
    h2.weight,
    h3.letterSpacing,
    h3.lineHeight,
    h3.size,
    h3.weight,
    h4.letterSpacing,
    h4.lineHeight,
    h4.size,
    h4.weight,
    h5.letterSpacing,
    h5.lineHeight,
    h5.size,
    h5.weight,
    h6.letterSpacing,
    h6.lineHeight,
    h6.size,
    h6.weight,
    overline.letterSpacing,
    overline.lineHeight,
    overline.size,
    overline.weight,
    subtitle1.letterSpacing,
    subtitle1.lineHeight,
    subtitle1.size,
    subtitle1.weight,
    subtitle2.letterSpacing,
    subtitle2.lineHeight,
    subtitle2.size,
    subtitle2.weight,
    currentTheme,
  ]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
