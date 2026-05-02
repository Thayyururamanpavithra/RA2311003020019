"use client";

import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Notification } from '../utils/api';
import { Log } from 'logging_middleware';

interface Props {
  notification: Notification;
  isNew: boolean;
  onView: (id: string) => void;
}

export const NotificationCard: React.FC<Props> = ({ notification, isNew, onView }) => {
  const handleClick = () => {
    if (isNew) {
      Log("frontend", "info", "state", "Notification marked as viewed");
      onView(notification.id);
    }
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case "Placement": return "success";
      case "Result": return "primary";
      case "Event": return "secondary";
      default: return "default";
    }
  };

  return (
    <Card 
      onClick={handleClick} 
      sx={{ 
        mb: 2, 
        cursor: isNew ? 'pointer' : 'default', 
        borderLeft: isNew ? '4px solid #1976d2' : '4px solid transparent',
        opacity: isNew ? 1 : 0.7,
        transition: '0.3s',
        '&:hover': {
          boxShadow: isNew ? 4 : 1
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip label={notification.type} color={getChipColor(notification.type) as any} size="small" />
          {isNew && <Typography variant="caption" color="primary"><strong>New</strong></Typography>}
        </Box>
        <Typography variant="body1">{notification.content || "No details provided."}</Typography>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
          {new Date(notification.timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};
