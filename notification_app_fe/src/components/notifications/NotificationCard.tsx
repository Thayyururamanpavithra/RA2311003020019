"use client";

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, alpha, useTheme, IconButton } from '@mui/material';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Briefcase, Trophy, Calendar, Clock, Check, Trash2, Info } from 'lucide-react';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Log } from 'logging_middleware';

interface NotificationCardProps {
  notification: Notification;
  isNew: boolean;
  onClick: (notification: Notification) => void;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  delay?: number;
}

const typeConfig = {
  Placement: { color: '#10b981', icon: Briefcase }, // Green
  Result: { color: '#3b82f6', icon: Trophy },     // Blue
  Event: { color: '#f59e0b', icon: Calendar },    // Orange
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  isNew, 
  onClick, 
  onMarkRead,
  onDismiss,
  delay = 0 
}) => {
  const theme = useTheme();
  const config = typeConfig[notification.type] || typeConfig.Event;
  const Icon = config.icon;
  const [isDismissed, setIsDismissed] = useState(false);

  // Swipe logic
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    [theme.palette.primary.main, 'transparent', theme.palette.error.main]
  );
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0, 0, 0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -80) {
      // Swipe left: Mark as Read
      if (onMarkRead) onMarkRead(notification.id);
      Log("frontend", "info", "state", `Notification ${notification.id} swiped left to mark read`);
    } else if (info.offset.x > 80) {
      // Swipe right: Dismiss
      setIsDismissed(true);
      if (onDismiss) onDismiss(notification.id);
      Log("frontend", "info", "state", `Notification ${notification.id} swiped right to dismiss`);
    }
  };

  if (isDismissed) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}
    >
      {/* Background Actions */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 0,
          borderRadius: 24
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          <Trash2 size={24} />
          <Typography variant="button" sx={{ fontWeight: 800 }}>Dismiss</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          <Typography variant="button" sx={{ fontWeight: 800 }}>Read</Typography>
          <Check size={24} />
        </Box>
      </motion.div>

      {/* Main Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, position: 'relative', zIndex: 1 }}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          onClick={() => onClick(notification)}
          sx={{ 
            cursor: 'pointer',
            borderLeft: `8px solid ${config.color}`,
            borderRadius: 6,
            background: theme.palette.background.paper,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                borderRadius: '16px',
                bgcolor: alpha(config.color, 0.12),
                color: config.color,
                mr: 2.5,
                flexShrink: 0,
                boxShadow: `0 8px 16px -4px ${alpha(config.color, 0.2)}`
              }}
            >
              <Icon size={26} />
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: config.color, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
                    {notification.type}
                  </Typography>
                  {isNew && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Chip 
                        label="NEW" 
                        size="small" 
                        color="primary" 
                        sx={{ height: 22, fontSize: '0.65rem', fontWeight: 900, borderRadius: 1.5 }} 
                      />
                    </motion.div>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <Clock size={14} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.6, color: 'text.primary', mb: 2 }}>
                {notification.message}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {notification.priorityScore > 350 && (
                    <Chip 
                      label="High Priority" 
                      size="small" 
                      variant="outlined" 
                      color="error" 
                      sx={{ height: 20, fontSize: '0.6rem', fontWeight: 800, borderStyle: 'dashed' }} 
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Info size={12} />
                  Score: {notification.priorityScore.toFixed(0)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
