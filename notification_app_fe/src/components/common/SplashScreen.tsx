"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Fade } from '@mui/material';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 500);
          setTimeout(onComplete, 1000);
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <Fade in={visible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Bell size={64} color="#3b82f6" />
        </motion.div>
        
        <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold', color: 'primary.main' }}>
          Campus Notifications
        </Typography>
        
        <Box sx={{ width: '200px', mt: 4 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Box>
    </Fade>
  );
};
