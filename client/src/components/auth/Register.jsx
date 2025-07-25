import React, { useState, useEffect } from 'react';
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
  Lock as LockIcon, 
  Person as PersonIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    department: '',
    role: 'user'
  });
  const [formErrors, setFormErrors] = useState({
    general: ''
  });
  const { register, user, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = formData;
    
    // Ensure all required fields are present
    if (!userData.username || !userData.email || !userData.password ||
        !userData.firstName || !userData.lastName) {
      setFormErrors({
        ...formErrors,
        general: 'Please fill in all required fields'
      });
      return;
    }
    
    try {
      const success = await register(userData);
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      setFormErrors({
        ...formErrors,
        general: 'Registration failed. Please try again.'
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
                U
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight="bold">
                Create an Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Join Uzalendo NMS
              </Typography>
            </Box>

            {(error || formErrors.general) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || formErrors.general}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                  />
                </Grid>
              </Grid>
              
              <TextField
                margin="normal"
                fullWidth
                id="department"
                label="Department"
                name="department"
                autoComplete="organization"
                value={formData.department}
                onChange={handleChange}
                error={!!formErrors.department}
                helperText={formErrors.department}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
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
                label="Confirm Password"
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
                startIcon={loading ? null : <RegisterIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                ) : null}
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" variant="body2">
                      Sign in
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;