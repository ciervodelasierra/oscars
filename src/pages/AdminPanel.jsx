import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../contexts/AuthContext';

function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [winners, setWinners] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [lockedCategories, setLockedCategories] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadCategories();
    fetchUsers();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      
      // Inicializar estados basados en los datos de la BD
      const lockedState = {};
      const winnersState = {};
      data.forEach(cat => {
        lockedState[cat._id] = cat.isLocked;
        if (cat.winner) {
          winnersState[cat._id] = cat.winner;
        }
      });
      
      setLockedCategories(lockedState);
      setWinners(winnersState);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las categorías');
      setLoading(false);
    }
  };

  const handleWinnerChange = (categoryId, value) => {
    setWinners(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const toggleCategoryLock = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const newLockedState = !lockedCategories[categoryId];
      
      await categoryService.toggleLock(categoryId, newLockedState, token);
      
      setLockedCategories(prev => ({
        ...prev,
        [categoryId]: newLockedState
      }));
      
      setSuccess(`Categoría ${newLockedState ? 'bloqueada' : 'desbloqueada'} exitosamente`);
    } catch (err) {
      setError('Error al cambiar el estado de la categoría');
    }
  };

  const handleConfirmWinner = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenDialog(true);
  };

  const confirmWinnerSelection = async () => {
    try {
      const token = localStorage.getItem('token');
      await categoryService.updateWinner(selectedCategory, winners[selectedCategory], token);
      
      setSuccess(`¡Ganador actualizado con éxito para ${categories.find(c => c._id === selectedCategory).name}!`);
      setOpenDialog(false);
      
      // Bloquear la categoría automáticamente
      await toggleCategoryLock(selectedCategory);
      
      // Recargar categorías para obtener datos actualizados
      loadCategories();
    } catch (err) {
      setError('Error al actualizar el ganador');
    }
  };

  const handleInitializeCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      await categoryService.initializeCategories(token);
      setSuccess('Categorías inicializadas correctamente');
      loadCategories();
    } catch (err) {
      setError('Error al inicializar las categorías');
    }
  };

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('No se pudieron cargar los usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar un usuario específico
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar el usuario');
      
      setSuccess('Usuario eliminado exitosamente');
      fetchUsers(); // Recargar la lista de usuarios
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar todos los usuarios
  const handleDeleteAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar los usuarios');
      
      setSuccess('Todos los usuarios han sido eliminados');
      setUsers([]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Diálogo de confirmación
  const handleOpenDialog = (user) => {
    setUserToDelete(user);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentUser?.isAdmin) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            No tienes permisos para acceder a esta página
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
            Panel de Administración
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleInitializeCategories}
            sx={{ mb: 4 }}
          >
            Inicializar Categorías
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleOpenDialog('all')}
            sx={{ mb: 2 }}
          >
            Eliminar Todos los Usuarios
          </Button>

          {categories.map((category) => (
            <Accordion
              key={category._id}
              expanded={expanded === category._id}
              onChange={() => setExpanded(expanded === category._id ? false : category._id)}
              disabled={lockedCategories[category._id]}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
                backgroundColor: 'background.paper',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    {category.name}
                  </Typography>
                  <Button
                    startIcon={lockedCategories[category._id] ? <LockIcon /> : <LockOpenIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryLock(category._id);
                    }}
                    sx={{ ml: 2 }}
                  >
                    {lockedCategories[category._id] ? 'Bloqueado' : 'Desbloquear'}
                  </Button>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup
                  value={winners[category._id] || ''}
                  onChange={(e) => handleWinnerChange(category._id, e.target.value)}
                >
                  {category.nominees.map((nominee) => (
                    <FormControlLabel
                      key={nominee.title || nominee.name}
                      value={nominee.title || nominee.name}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">
                            {nominee.title || nominee.name}
                          </Typography>
                          {nominee.details && (
                            <Typography variant="body2" color="text.secondary">
                              {nominee.details}
                            </Typography>
                          )}
                          {nominee.film && (
                            <Typography variant="body2" color="text.secondary">
                              {nominee.film}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleConfirmWinner(category._id)}
                  disabled={!winners[category._id]}
                  sx={{ mt: 2 }}
                >
                  Confirmar Ganador
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.isAdmin ? 'Admin' : 'Usuario'}</TableCell>
                <TableCell>
                  <IconButton 
                    color="error" 
                    onClick={() => handleOpenDialog(user)}
                    disabled={user.isAdmin} // No permitir eliminar admins
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          {userToDelete === 'all' 
            ? '¿Estás seguro de que quieres eliminar todos los usuarios?'
            : `¿Estás seguro de que quieres eliminar al usuario ${userToDelete?.email}?`
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={() => userToDelete === 'all' 
              ? handleDeleteAllUsers() 
              : handleDeleteUser(userToDelete._id)
            } 
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPanel; 