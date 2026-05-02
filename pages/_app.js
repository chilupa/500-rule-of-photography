import { useEffect } from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import { SELECT_MENU_PROPS } from '../src/styles/selectMenuProps'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7CB8FF',
      light: '#A9D0FF',
      dark: '#5090E6',
    },
    secondary: {
      main: '#7FD8BE',
    },
    background: {
      default: '#060912',
      // Opaque: menus/popovers use `paper`; translucent panels use explicit sx (e.g. glass).
      paper: '#161b2a',
    },
    text: {
      primary: '#F0F4FC',
      secondary: 'rgba(240, 244, 252, 0.58)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  shape: {
    borderRadius: 14,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: 15,
    h3: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      fontSize: '1.85rem',
      fontWeight: 700,
      letterSpacing: '-0.035em',
      lineHeight: 1.15,
      '@media (min-width:600px)': {
        fontSize: '2.35rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.75rem',
      },
    },
    h4: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      fontSize: '1.45rem',
      '@media (min-width:600px)': {
        fontSize: '1.65rem',
      },
    },
    h6: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '1.05rem',
    },
    subtitle1: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '0.98rem',
      lineHeight: 1.35,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.78rem',
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      fontWeight: 600,
      letterSpacing: '0.14em',
      fontSize: '0.7rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          opacity: 1,
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          opacity: 1,
          border: `1px solid ${theme.palette.divider}`,
          [theme.breakpoints.down('sm')]: {
            maxWidth:
              'calc(100vw - max(24px, env(safe-area-inset-left) + env(safe-area-inset-right)))',
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 44,
          paddingTop: 10,
          paddingBottom: 10,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          borderRadius: 999,
        },
        containedPrimary: {
          boxShadow: '0 4px 20px rgba(92, 158, 236, 0.38)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(92, 158, 236, 0.48)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(124, 184, 255, 0.35)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(124, 184, 255, 0.65)',
            borderWidth: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#A9D0FF',
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        MenuProps: SELECT_MENU_PROPS,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
})

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, viewport-fit=cover" />
        <meta name="theme-color" content="#060912" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}