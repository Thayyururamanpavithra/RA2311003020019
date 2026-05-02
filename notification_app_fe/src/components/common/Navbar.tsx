"use client";

import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Badge, Box, useMediaQuery, useTheme, Drawer, List, 
  ListItem, ListItemButton, ListItemText, ListItemIcon,
  alpha, Tooltip, Paper
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAppTheme } from '@/context/ThemeContext';
import { useNotificationsContext } from '@/context/NotificationContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeRoundedIcon fontSize="small" /> },
  { label: 'Notifications', path: '/all', icon: <NotificationsRoundedIcon fontSize="small" /> },
  { label: 'Priority', path: '/priority', icon: <InboxRoundedIcon fontSize="small" /> },
  { label: 'Stats', path: '/stats', icon: <BarChartRoundedIcon fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
];

export const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useAppTheme();
  const { unreadCount, nextRefreshIn } = useNotificationsContext();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: scrolled 
          ? alpha(theme.palette.background.default, 0.8) 
          : 'transparent',
        borderBottom: scrolled 
          ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
          : 'none',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
        <Box 
          component={Link} 
          href="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <NotificationsRoundedIcon sx={{ fontSize: 22, color: 'white' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: -1, 
              display: { xs: 'none', sm: 'block' },
              fontSize: '1.4rem'
            }}
          >
            Campus Alerts
          </Typography>
        </Box>

        {!isMobile && (
          <Paper 
            elevation={0}
            sx={{ 
              display: 'flex', 
              px: 1, 
              py: 0.5, 
              borderRadius: '16px',
              bgcolor: alpha(theme.palette.text.primary, 0.03),
              border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                color="inherit"
                sx={{
                  position: 'relative',
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  fontWeight: pathname === item.path ? 800 : 500,
                  fontSize: '0.85rem',
                  color: pathname === item.path ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' },
                }}
              >
                {item.label}
                {pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: '20%',
                      right: '20%',
                      height: '3px',
                      borderRadius: '3px',
                      background: theme.palette.primary.main,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            ))}
          </Paper>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ width: 44, height: 44 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === 'dark' ? (
                    <WbSunnyRoundedIcon fontSize="small" />
                  ) : (
                    <DarkModeRoundedIcon fontSize="small" />
                  )}
                </motion.div>
              </AnimatePresence>
            </IconButton>
          </Tooltip>

          <Tooltip title={`Next update in ${nextRefreshIn}s`}>
            <IconButton color="inherit" sx={{ width: 44, height: 44 }}>
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    minWidth: 18,
                    height: 18,
                    animation: unreadCount > 0 ? 'pulse-badge 2s infinite' : 'none',
                  },
                  '@keyframes pulse-badge': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                    '70%': { transform: 'scale(1.2)', boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                  },
                }}
              >
                <motion.div
                  animate={unreadCount > 0 ? {
                    rotate: [0, -15, 15, -15, 15, 0],
                  } : {}}
                  transition={{ 
                    duration: 0.5, 
                    repeat: unreadCount > 0 ? Infinity : 0, 
                    repeatDelay: 4 
                  }}
                >
                  <NotificationsRoundedIcon fontSize="small" />
                </motion.div>
              </Badge>
            </IconButton>
          </Tooltip>

          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={() => setDrawerOpen(true)}
              sx={{ width: 44, height: 44, ml: 1 }}
            >
              <MenuRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { 
              width: 280, 
              bgcolor: 'background.default',
              backgroundImage: 'none',
              p: 2
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.path}
                onClick={() => setDrawerOpen(false)}
                selected={pathname === item.path}
                sx={{ 
                  borderRadius: 3,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: pathname === item.path ? 800 : 600 }}>
                    {item.label}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Paper sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), border: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BoltRoundedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>AUTO-REFRESH</Typography>
                <Typography variant="caption" color="text.secondary">Next update in {nextRefreshIn}s</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Drawer>
    </AppBar>
  );
};
