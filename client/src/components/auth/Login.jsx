import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Material UI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  useTheme,
  Avatar,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Login as LoginIcon 
} from '@mui/icons-material';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user, loading, error } = useAuthStore();
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
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials, rememberMe);
    if (success) {
      navigate('/dashboard');
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
                Welcome to Uzalendo NMS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to your account
              </Typography>
            </Box>

            {error && (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'error.light', 
                  color: 'error.dark',
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}
              >
                {error}
              </Box>
            )}

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
                value={credentials.email}
                onChange={handleChange}
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
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Grid container sx={{ mt: 2, mb: 2 }}>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        value="remember" 
                        color="primary" 
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                    }
                    label="Remember me"
                  />
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              
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
                startIcon={loading ? null : <LoginIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                ) : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register" variant="body2">
                      Sign up
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

export default Login;