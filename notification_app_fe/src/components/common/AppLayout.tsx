"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction, Paper, alpha } from '@mui/material';
import { Navbar } from './Navbar';
import { SplashScreen } from './SplashScreen';
import { Home, Bell, Inbox, BarChart2, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Premium Gradient Background Elements */}
      <Box 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '-10%', 
            width: '40%', 
            height: '40%', 
            borderRadius: '50%', 
            background: alpha(theme.palette.primary.main, 0.05),
            filter: 'blur(100px)',
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: '10%', 
            right: '-10%', 
            width: '50%', 
            height: '50%', 
            borderRadius: '50%', 
            background: alpha(theme.palette.secondary.main, 0.05),
            filter: 'blur(120px)',
          }} 
        />
      </Box>

      <Navbar />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 3, md: 6 }, 
            pb: isMobile ? 12 : 6,
            flexGrow: 1
          }}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>

      {isMobile && (
        <Paper 
          elevation={0}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 20, 
            right: 20, 
            zIndex: 1000,
            borderRadius: '24px',
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
          }}
        >
          <BottomNavigation
            value={pathname}
            onChange={(event, newValue) => {
              router.push(newValue);
            }}
            sx={{ 
              height: 70, 
              bgcolor: 'transparent',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                padding: '12px 0',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                  }
                }
              }
            }}
          >
            <BottomNavigationAction label="Home" value="/" icon={<Home size={22} />} />
            <BottomNavigationAction label="Inbox" value="/all" icon={<Bell size={22} />} />
            <BottomNavigationAction label="Top" value="/priority" icon={<Inbox size={22} />} />
            <BottomNavigationAction label="Stats" value="/stats" icon={<BarChart2 size={22} />} />
            <BottomNavigationAction label="Settings" value="/settings" icon={<Settings size={22} />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};
