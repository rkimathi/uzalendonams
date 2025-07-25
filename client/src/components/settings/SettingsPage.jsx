import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

const SettingsPage = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [formChanged, setFormChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    phone: '+1 (555) 123-4567',
    position: 'Network Administrator',
    department: 'IT Operations'
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
    dailyDigest: true,
    maintenanceNotices: true
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    darkMode: theme.palette.mode === 'dark',
    language: 'English',
    timeZone: 'UTC+3:00',
    dateFormat: 'DD/MM/YYYY',
    autoRefresh: true,
    refreshInterval: 30
  });

  // API keys state
  const [apiKeys] = useState([
    { id: 1, name: 'Monitoring System', key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', created: '2025-01-15', lastUsed: '2025-07-24' },
    { id: 2, name: 'Backup System', key: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', created: '2025-03-22', lastUsed: '2025-07-20' }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setFormChanged(true);
    setSaveSuccess(false);
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    });
    setFormChanged(true);
    setSaveSuccess(false);
  };

  const handleSystemSettingChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSystemSettings({
      ...systemSettings,
      [e.target.name]: value
    });
    setFormChanged(true);
    setSaveSuccess(false);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', { profile, notifications, systemSettings });
    
    // Show success message
    setSaveSuccess(true);
    setFormChanged(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your account and system preferences
            </Typography>
          </Box>
          
          {formChanged && (
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          )}
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* Settings Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
              <Tab 
                icon={<PersonIcon />} 
                label="Profile" 
                iconPosition="start"
              />
              <Tab 
                icon={<NotificationsIcon />} 
                label="Notifications" 
                iconPosition="start"
              />
              <Tab 
                icon={<PaletteIcon />} 
                label="System" 
                iconPosition="start"
              />
              <Tab 
                icon={<VpnKeyIcon />} 
                label="API Keys" 
                iconPosition="start"
              />
              <Tab 
                icon={<SecurityIcon />} 
                label="Security" 
                iconPosition="start"
              />
            </Tabs>
          </Box>
          
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        mb: 2,
                        bgcolor: theme.palette.primary.main,
                        fontSize: 48
                      }}
                    >
                      {profile.name.charAt(0)}
                    </Avatar>
                    <Button variant="outlined" size="small">
                      Change Photo
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Personal Information
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        value={profile.position}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={profile.department}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure how and when you receive notifications about system events and alerts.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title="Alert Notifications" />
                    <Divider />
                    <CardContent>
                      <List disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Email Alerts" 
                            secondary="Receive alerts via email"
                          />
                          <Switch
                            edge="end"
                            name="emailAlerts"
                            checked={notifications.emailAlerts}
                            onChange={handleNotificationChange}
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <NotificationsIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="SMS Alerts" 
                            secondary="Receive alerts via SMS"
                          />
                          <Switch
                            edge="end"
                            name="smsAlerts"
                            checked={notifications.smsAlerts}
                            onChange={handleNotificationChange}
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <SecurityIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Critical Alerts Only" 
                            secondary="Only receive critical priority alerts"
                          />
                          <Switch
                            edge="end"
                            name="criticalOnly"
                            checked={notifications.criticalOnly}
                            onChange={handleNotificationChange}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader title="System Notifications" />
                    <Divider />
                    <CardContent>
                      <List disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Daily Digest" 
                            secondary="Receive a daily summary of system activity"
                          />
                          <Switch
                            edge="end"
                            name="dailyDigest"
                            checked={notifications.dailyDigest}
                            onChange={handleNotificationChange}
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <NotificationsIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Maintenance Notices" 
                            secondary="Receive notifications about scheduled maintenance"
                          />
                          <Switch
                            edge="end"
                            name="maintenanceNotices"
                            checked={notifications.maintenanceNotices}
                            onChange={handleNotificationChange}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* System Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure system-wide settings and preferences.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Display Settings" />
                    <Divider />
                    <CardContent>
                      <List disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <PaletteIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Dark Mode" 
                            secondary="Use dark theme throughout the application"
                          />
                          <Switch
                            edge="end"
                            name="darkMode"
                            checked={systemSettings.darkMode}
                            onChange={handleSystemSettingChange}
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <LanguageIcon />
                          </ListItemIcon>
                          <ListItemText primary="Language" />
                          <Box sx={{ minWidth: 150 }}>
                            <TextField
                              select
                              fullWidth
                              name="language"
                              value={systemSettings.language}
                              onChange={handleSystemSettingChange}
                              SelectProps={{
                                native: true,
                              }}
                              variant="outlined"
                              size="small"
                            >
                              <option value="English">English</option>
                              <option value="French">French</option>
                              <option value="Spanish">Spanish</option>
                              <option value="German">German</option>
                            </TextField>
                          </Box>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Time & Date Settings" />
                    <Divider />
                    <CardContent>
                      <List disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <LanguageIcon />
                          </ListItemIcon>
                          <ListItemText primary="Time Zone" />
                          <Box sx={{ minWidth: 150 }}>
                            <TextField
                              select
                              fullWidth
                              name="timeZone"
                              value={systemSettings.timeZone}
                              onChange={handleSystemSettingChange}
                              SelectProps={{
                                native: true,
                              }}
                              variant="outlined"
                              size="small"
                            >
                              <option value="UTC-8:00">UTC-8:00 (PST)</option>
                              <option value="UTC-5:00">UTC-5:00 (EST)</option>
                              <option value="UTC+0:00">UTC+0:00 (GMT)</option>
                              <option value="UTC+1:00">UTC+1:00 (CET)</option>
                              <option value="UTC+3:00">UTC+3:00 (EAT)</option>
                              <option value="UTC+8:00">UTC+8:00 (CST)</option>
                            </TextField>
                          </Box>
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <LanguageIcon />
                          </ListItemIcon>
                          <ListItemText primary="Date Format" />
                          <Box sx={{ minWidth: 150 }}>
                            <TextField
                              select
                              fullWidth
                              name="dateFormat"
                              value={systemSettings.dateFormat}
                              onChange={handleSystemSettingChange}
                              SelectProps={{
                                native: true,
                              }}
                              variant="outlined"
                              size="small"
                            >
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </TextField>
                          </Box>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader title="Data Refresh Settings" />
                    <Divider />
                    <CardContent>
                      <List disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <RefreshIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Auto Refresh" 
                            secondary="Automatically refresh data at regular intervals"
                          />
                          <Switch
                            edge="end"
                            name="autoRefresh"
                            checked={systemSettings.autoRefresh}
                            onChange={handleSystemSettingChange}
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <RefreshIcon />
                          </ListItemIcon>
                          <ListItemText primary="Refresh Interval (seconds)" />
                          <Box sx={{ width: 150 }}>
                            <TextField
                              type="number"
                              name="refreshInterval"
                              value={systemSettings.refreshInterval}
                              onChange={handleSystemSettingChange}
                              variant="outlined"
                              size="small"
                              disabled={!systemSettings.autoRefresh}
                              InputProps={{
                                inputProps: { min: 5, max: 300 }
                              }}
                            />
                          </Box>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* API Keys Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  API Keys
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Generate New Key
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage API keys for external system integration.
              </Typography>
              
              <Card variant="outlined">
                <List disablePadding>
                  {apiKeys.map((apiKey, index) => (
                    <React.Fragment key={apiKey.id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        secondaryAction={
                          <Box>
                            <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemIcon>
                          <VpnKeyIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={apiKey.name}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {apiKey.key}
                              </Typography>
                              <br />
                              Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Box>
          )}
          
          {/* Security Tab */}
          {activeTab === 4 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage your account security settings.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Change Password" />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            name="currentPassword"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            name="newPassword"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="contained" 
                            color="primary"
                          >
                            Update Password
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Two-Factor Authentication" />
                    <Divider />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                          control={<Switch />}
                          label="Enable Two-Factor Authentication"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Add an extra layer of security to your account by requiring a verification code in addition to your password.
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        disabled
                      >
                        Set Up 2FA
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                    <CardHeader 
                      title="Danger Zone" 
                      titleTypographyProps={{ color: theme.palette.error.main }}
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Delete Account
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          color="error"
                        >
                          Delete Account
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default SettingsPage;