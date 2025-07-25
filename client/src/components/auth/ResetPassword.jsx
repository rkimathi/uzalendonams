import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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
  Lock as LockIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [resetSuccess, setResetSuccess] = useState(false);
  const { resetPassword, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();
  const theme = useTheme();

  useEffect(() => {
    // Validate token exists
    if (!token) {
      setFormErrors({
        ...formErrors,
        general: 'Invalid or missing reset token. Please request a new password reset.'
      });
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = { ...formErrors };
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else {
      errors.password = '';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else {
      errors.confirmPassword = '';
    }
    
    setFormErrors(errors);
    return !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await resetPassword(token, formData.password);
      if (success) {
        setResetSuccess(true);
      }
    } catch (err) {
      setFormErrors({
        ...formErrors,
        general: 'Failed to reset password. Please try again.'
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
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {resetSuccess 
                  ? 'Your password has been reset successfully'
                  : 'Enter your new password'}
              </Typography>
            </Box>

            {(error || formErrors.general) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || formErrors.general}
              </Alert>
            )}

            {resetSuccess ? (
              <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your password has been reset successfully.
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
                  Sign In with New Password
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
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

export default ResetPassword;