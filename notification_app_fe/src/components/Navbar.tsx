"use client";

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Campus Notifications
        </Typography>
        <Box>
          <Button 
            component={Link} 
            href="/" 
            color={pathname === '/' ? 'primary' : 'inherit'}
          >
            All Notifications
          </Button>
          <Button 
            component={Link} 
            href="/priority" 
            color={pathname === '/priority' ? 'primary' : 'inherit'}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
