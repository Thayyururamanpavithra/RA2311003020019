"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Fade, alpha } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 800);
          setTimeout(onComplete, 1500);
          return 100;
        }
        const diff = Math.random() * 15 + 5;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <Fade in={visible} timeout={800}>
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#020617', // Deep slate/navy
              backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
              color: 'white',
            }}
          >
            {/* Animated Background Particles */}
            <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.3 }}>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, Math.random() * -100 + '%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 5 + 3, 
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  style={{
                    position: 'absolute',
                    width: Math.random() * 4 + 1,
                    height: Math.random() * 4 + 1,
                    background: '#3b82f6',
                    borderRadius: '50%',
                  }}
                />
              ))}
            </Box>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            >
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.4, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: -20,
                    borderRadius: '50%',
                    background: alpha('#3b82f6', 0.15),
                    filter: 'blur(20px)',
                  }}
                />
                <Box 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '30px', 
                    bgcolor: alpha('#3b82f6', 0.1),
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                  }}
                >
                  <NotificationsRoundedIcon sx={{ fontSize: 48, color: '#60a5fa' }} />
                </Box>
              </Box>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ textAlign: 'center', marginTop: 40 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: -2,
                  background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Campus Alerts
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, mt: 1, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.6 }}>
                Intelligent Notification System
              </Typography>
            </motion.div>
            
            <Box sx={{ width: '240px', mt: 6, position: 'relative' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: alpha('#3b82f6', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', opacity: 0.8 }}>
                  INITIALIZING MODULES
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.5 }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
            </Box>

            <Box sx={{ position: 'absolute', bottom: 40, display: 'flex', gap: 4, opacity: 0.3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BoltRoundedIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>REAL-TIME</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldRoundedIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>SECURE</Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </AnimatePresence>
  );
};
