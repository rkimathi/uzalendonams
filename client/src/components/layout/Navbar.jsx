import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Material UI imports
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Toolbar,
  Typography,
  alpha,
  styled,
  useTheme
} from '@mui/material';

// Material UI icons
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Styled search input
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuthStore();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const theme = useTheme();

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Left side - Menu toggle and brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box component={Link} to="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                mr: 1,
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              U
            </Avatar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                color: theme.palette.text.primary,
                fontWeight: 600
              }}
            >
              Uzalendo NMS
            </Typography>
          </Box>
        </Box>

        {/* Center - Search */}
        <Search sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, maxWidth: 400, mx: 'auto' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Dark mode toggle */}
          <IconButton
            color="inherit"
            onClick={toggleDarkMode}
            sx={{ ml: 1 }}
            aria-label="toggle dark mode"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{ ml: 1 }}
            aria-label="show notifications"
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            open={Boolean(notificationsAnchor)}
            anchorEl={notificationsAnchor}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle1" fontWeight="medium">Notifications</Typography>
            </Box>
            <List sx={{ p: 0 }}>
              <ListItem button sx={{ py: 1.5, px: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <ListItemText
                  primary="New critical alert"
                  secondary="Server CPU usage above 90%"
                  secondaryTypographyProps={{ 
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    sx: { mt: 0.5 }
                  }}
                />
                <Typography variant="caption" color="text.secondary">10m ago</Typography>
              </ListItem>
              <ListItem button sx={{ py: 1.5, px: 2 }}>
                <ListItemText
                  primary="Ticket assigned"
                  secondary="Ticket #1234 has been assigned to you"
                  secondaryTypographyProps={{ 
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    sx: { mt: 0.5 }
                  }}
                />
                <Typography variant="caption" color="text.secondary">1h ago</Typography>
              </ListItem>
            </List>
            <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
              <Button 
                component={Link} 
                to="/notifications" 
                size="small" 
                color="primary"
                onClick={handleNotificationsClose}
              >
                View all notifications
              </Button>
            </Box>
          </Popover>

          {/* User menu */}
          <Button
            onClick={handleUserMenuOpen}
            color="inherit"
            sx={{ 
              ml: 2,
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
            startIcon={
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            }
          >
            <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
              <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                {user?.name || 'User'}
              </Typography>
            </Box>
          </Button>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { width: 200, mt: 1.5 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2">{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;