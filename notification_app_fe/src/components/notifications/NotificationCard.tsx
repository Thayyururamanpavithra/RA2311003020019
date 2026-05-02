"use client";

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Briefcase, Trophy, Calendar, Clock } from 'lucide-react';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  notification: Notification;
  isNew: boolean;
  onClick: (notification: Notification) => void;
  delay?: number;
}

const typeConfig = {
  Placement: { color: '#10b981', icon: Briefcase }, // Green
  Result: { color: '#3b82f6', icon: Trophy },     // Blue
  Event: { color: '#f59e0b', icon: Calendar },    // Orange
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, isNew, onClick, delay = 0 }) => {
  const theme = useTheme();
  const config = typeConfig[notification.type] || typeConfig.Event;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(notification)}
    >
      <Card 
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          borderLeft: `6px solid ${config.color}`,
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '10px',
              bgcolor: alpha(config.color, 0.1),
              color: config.color,
              mr: 2,
              flexShrink: 0,
            }}
          >
            <Icon size={22} />
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {notification.type}
                </Typography>
                {isNew && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Chip 
                      label="NEW" 
                      size="small" 
                      color="primary" 
                      sx={{ height: 20, fontSize: '0.625rem', fontWeight: 900 }} 
                    />
                  </motion.div>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <Clock size={14} />
                <Typography variant="caption">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
              {notification.message}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Priority: {notification.priorityScore.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
