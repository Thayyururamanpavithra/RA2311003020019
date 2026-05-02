"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Navbar } from './Navbar';
import { SplashScreen } from './SplashScreen';
import { Home, Bell, Inbox, BarChart2, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const splashSeen = sessionStorage.getItem('splashSeen');
    if (splashSeen) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashSeen', 'true');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          py: 4, 
          pb: isMobile ? 10 : 4,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {children}
      </Container>

      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            value={pathname}
            onChange={(event, newValue) => {
              router.push(newValue);
            }}
            showLabels
            sx={{ bgcolor: 'background.paper', backdropFilter: 'blur(10px)' }}
          >
            <BottomNavigationAction label="Home" value="/" icon={<Home size={20} />} />
            <BottomNavigationAction label="All" value="/all" icon={<Bell size={20} />} />
            <BottomNavigationAction label="Priority" value="/priority" icon={<Inbox size={20} />} />
            <BottomNavigationAction label="Stats" value="/stats" icon={<BarChart2 size={20} />} />
            <BottomNavigationAction label="Settings" value="/settings" icon={<Settings size={20} />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};
