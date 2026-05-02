"use client";

import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Badge, Box, useMediaQuery, useTheme, Drawer, List, 
  ListItem, ListItemButton, ListItemText, ListItemIcon
} from '@mui/material';
import { 
  Bell, Sun, Moon, Menu as MenuIcon, 
  Home, Inbox, BarChart2, Settings 
} from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useNotificationsContext } from '@/context/NotificationContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/', icon: <Home size={20} /> },
  { label: 'Notifications', path: '/all', icon: <Bell size={20} /> },
  { label: 'Priority', path: '/priority', icon: <Inbox size={20} /> },
  { label: 'Stats', path: '/stats', icon: <BarChart2 size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useAppTheme();
  const { unreadCount } = useNotificationsContext();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bell color={theme.palette.primary.main} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
            Campus Notifications
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                color="inherit"
                sx={{
                  position: 'relative',
                  fontWeight: pathname === item.path ? 700 : 400,
                  '&:hover': { bgcolor: 'transparent' },
                }}
              >
                {item.label}
                {pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 10,
                      right: 10,
                      height: '2px',
                      background: theme.palette.primary.main,
                    }}
                  />
                )}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            <motion.div
              initial={false}
              animate={{ rotate: mode === 'dark' ? 180 : 0 }}
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </IconButton>

          <IconButton color="inherit">
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                },
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                  '70%': { transform: 'scale(1.1)', boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
                  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                },
              }}
            >
              <motion.div
                animate={unreadCount > 0 ? {
                  rotate: [0, -10, 10, -10, 10, 0],
                } : {}}
                transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 5 }}
              >
                <Bell size={20} />
              </motion.div>
            </Badge>
          </IconButton>

          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon size={20} />
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
            sx: { width: 250, bgcolor: 'background.default' }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Menu</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
