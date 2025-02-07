import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { authService } from '../services/authService';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  margin: theme.spacing(0, 1),
  '&:hover': {
    color: theme.palette.primary.light,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 'bold',
            letterSpacing: 1
          }}
        >
          PRODE OSCARS 2025
        </Typography>
        <Box>
          <StyledButton component={Link} to="/">
            Inicio
          </StyledButton>
          {isLoggedIn && (
            <StyledButton component={Link} to="/predictions">
              Predicciones
            </StyledButton>
          )}
          {isAdmin && (
            <StyledButton component={Link} to="/admin">
              Admin
            </StyledButton>
          )}
          {isLoggedIn ? (
            <StyledButton onClick={handleLogout}>
              Cerrar Sesión
            </StyledButton>
          ) : (
            <>
              <StyledButton component={Link} to="/login">
                Login
              </StyledButton>
              <StyledButton component={Link} to="/register">
                Registro
              </StyledButton>
            </>
          )}
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

export default Navbar; 