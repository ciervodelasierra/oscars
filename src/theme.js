import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C5A572', // dorado
      light: '#D4BC91',
      dark: '#B69055',
    },
    secondary: {
      main: '#000000', // negro
    },
    background: {
      default: '#FFFFFF', // blanco
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#C5A572',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    h4: {
      color: '#C5A572',
      fontWeight: 600,
    },
    h5: {
      color: '#C5A572',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#C5A572',
          '&:hover': {
            backgroundColor: '#B69055',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #C5A572',
        },
      },
    },
  },
});

export default theme; 