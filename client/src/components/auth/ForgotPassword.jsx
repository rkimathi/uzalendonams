import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Material UI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  useTheme,
  Avatar,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Email as EmailIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    general: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (formErrors.email) {
      setFormErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = { ...formErrors };
    
    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    } else {
      errors.email = '';
    }
    
    setFormErrors(errors);
    return !errors.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await forgotPassword(email);
      if (success) {
        setSubmitted(true);
      }
    } catch (err) {
      setFormErrors({
        ...formErrors,
        general: 'Failed to process request. Please try again.'
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card 
          elevation={8}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                  fontSize: 24
                }}
              >
                <LockResetIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight="bold">
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {submitted 
                  ? 'Check your email for instructions to reset your password'
                  : 'Enter your email address and we\'ll send you instructions to reset your password'}
              </Typography>
            </Box>

            {(error || formErrors.general) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || formErrors.general}
              </Alert>
            )}

            {submitted ? (
              <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password reset instructions have been sent to your email.
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Return to Login
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  ) : null}
                  {loading ? 'Processing...' : 'Reset Password'}
                </Button>
                
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{' '}
                      <Link component={RouterLink} to="/login" variant="body2">
                        Sign in
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ForgotPassword;