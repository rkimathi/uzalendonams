import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Material UI imports
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Button,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';

// Material UI icons
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  Storage as ServerIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Warning as WarningIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const theme = useTheme();

  const isAdmin = user?.role === 'admin';
  const drawerWidth = collapsed ? 72 : 240;

  const menuItems = [
    {
      name: 'Dashboard',
      icon: DashboardIcon,
      path: '/dashboard',
      exact: true
    },
    {
      name: 'Tickets',
      icon: TicketIcon,
      path: '/tickets'
    },
    {
      name: 'Monitoring',
      icon: ServerIcon,
      path: '/monitoring'
    },
    {
      name: 'Alerts',
      icon: WarningIcon,
      path: '/alerts'
    },
    {
      name: 'Reports',
      icon: BarChartIcon,
      path: '/reports'
    },
    {
      name: 'Users',
      icon: PeopleIcon,
      path: '/users',
      adminOnly: true
    },
    {
      name: 'Admin',
      icon: SecurityIcon,
      path: '/admin',
      adminOnly: true
    },
    {
      name: 'Settings',
      icon: SettingsIcon,
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/')) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Sidebar header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(2),
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: 16,
                fontWeight: 'bold',
                mr: 1,
              }}
            >
              U
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Uzalendo NMS
            </Typography>
          </Box>
        )}
        <IconButton onClick={toggleSidebar} size="small">
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          
          const active = isActive(item.path);
          
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 1,
                  justifyContent: collapsed ? 'center' : 'initial',
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{ 
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                )}
                {active && !collapsed && (
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        {!collapsed ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={logout}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Sign out
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Uzalendo NMS v1.0
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                © 2025 Uzalendo Systems
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <IconButton
              color="primary"
              onClick={logout}
              size="small"
              sx={{ 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;