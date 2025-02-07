import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';

function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [potInfo, setPotInfo] = useState({
    amount: 0,
    participants: 0
  });

  // Función para obtener la información del pozo
  const fetchPotInfo = async () => {
    try {
      console.log('Intentando obtener información del pozo...');
      const response = await fetch('http://localhost:5000/api/count');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.count !== undefined) {
        setPotInfo({
          amount: data.count * 5000,
          participants: data.count
        });
      }
    } catch (error) {
      console.error('Error al obtener información del pozo:', error);
    }
  };

  useEffect(() => {
    // Contador regresivo
    const ceremonyDate = new Date('2025-03-02T20:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = ceremonyDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timerCountdown = setInterval(calculateTimeLeft, 1000);

    // Obtener información del pozo inicialmente
    fetchPotInfo();
    
    // Actualizar el pozo cada 30 segundos
    const timerPot = setInterval(fetchPotInfo, 30000);

    return () => {
      clearInterval(timerCountdown);
      clearInterval(timerPot);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Contenido principal */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Prode de los Oscars 2025
                </Typography>
                <Typography variant="body1" paragraph>
                  Participá prediciendo los ganadores de todas las categorías de los Premios de la Academia.
                </Typography>
                <Typography variant="body1" paragraph>
                  ¿Cómo funciona?
                </Typography>
                <Typography component="ul" sx={{ pl: 2 }}>
                  <li>Registrate o inicia sesión para participar</li>
                  <li>El costo de participación es de $5.000</li>
                  <li>Realizá tus predicciones antes del inicio de la ceremonia (2 de marzo)</li>
                  <li>Ganá puntos por cada predicción correcta</li>
                  <li>Los puntos se calculan según cuántas personas fallaron en su predicción</li>
                  <li>La persona ganadora se llevará el pozo acumulado y una estatuilla de los Oscars (:</li>
                </Typography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src="/oscar-statue.png"
                  alt="Estatuilla de los Oscar"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Contador */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              background: 'linear-gradient(145deg, #C0B283 0%, #DCD0C0 100%)',
              color: '#373737',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              align="center"
              sx={{ 
                color: '#000',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              Cuenta Regresiva
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              mt: 2
            }}>
              {[
                { value: timeLeft.days, label: 'Días' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Minutos' },
                { value: timeLeft.seconds, label: 'Segundos' }
              ].map(({ value, label }) => (
                <Box 
                  key={label} 
                  sx={{ 
                    textAlign: 'center',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#000',
                      mb: 1
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mt: 3,
                color: '#000',
                fontStyle: 'italic'
              }}
            >
              2 de Marzo, 2025 - 20:00hs
            </Typography>
          </Paper>
        </Grid>

        {/* Pozo Acumulado */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              background: 'linear-gradient(145deg, #000000 0%, #333333 100%)',
              color: '#C0B283',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Pozo Acumulado
            </Typography>
            <Typography 
              variant="h2"
              sx={{ 
                fontWeight: 'bold',
                color: '#DCD0C0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              ${potInfo.amount.toLocaleString('es-AR')}
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{ 
                color: '#C0B283',
                mt: 1
              }}
            >
              {potInfo.participants} participante{potInfo.participants !== 1 ? 's' : ''} registrado{potInfo.participants !== 1 ? 's' : ''}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 