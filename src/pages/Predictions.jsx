import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { categories, savePredictionsToStorage, loadPredictionsFromStorage } from '../data/oscarsData';
import { useAuth } from '../contexts/AuthContext';

function Predictions() {
  const [predictions, setPredictions] = useState({});
  const [expanded, setExpanded] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Si hay un usuario, cargar sus predicciones
    if (currentUser) {
      const savedPredictions = loadPredictionsFromStorage(currentUser.email); // Usar email en lugar de id
      if (savedPredictions) {
        setPredictions(savedPredictions);
      } else {
        setPredictions({});
      }
    }
  }, [currentUser]);

  const handlePredictionChange = (categoryId, nominee) => {
    if (!currentUser) return; // Si no hay usuario, no guardar

    const newPredictions = {
      ...predictions,
      [categoryId]: nominee
    };
    setPredictions(newPredictions);
    savePredictionsToStorage(newPredictions, currentUser.email); // Usar email en lugar de id
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">
            Debes iniciar sesión para hacer tus predicciones
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Predicciones
          </Typography>
          
          {categories.map((category) => (
            <Accordion 
              key={category.id}
              expanded={expanded === category.id}
              onChange={handleAccordionChange(category.id)}
              sx={{ mt: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  '&.Mui-expanded': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6">
                    {category.name}
                  </Typography>
                  {predictions[category.id] && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      Seleccionado: {predictions[category.id]}
                    </Typography>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={predictions[category.id] || ''}
                    onChange={(e) => handlePredictionChange(category.id, e.target.value)}
                  >
                    {category.nominees.map((nominee) => (
                      <FormControlLabel
                        key={nominee.title || nominee.name}
                        value={nominee.title || nominee.name}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography>
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
                </FormControl>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Container>
  );
}

export default Predictions; 