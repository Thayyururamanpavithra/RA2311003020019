"use client";

import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Chip, alpha, useTheme,
  IconButton, Divider
} from '@mui/material';
import { X, Share2, Copy, Calendar, Clock, BarChart2 } from 'lucide-react';
import { Notification } from '@/types';
import { format } from 'date-fns';
import { Log } from 'logging_middleware';

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose, onMarkRead }) => {
  const theme = useTheme();

  if (!notification) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(notification.message);
    Log("frontend", "info", "component", `Notification content copied to clipboard`);
  };

  return (
    <Dialog 
      open={!!notification} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            background: theme.palette.mode === 'dark' ? alpha('#1e293b', 0.9) : alpha('#ffffff', 0.9),
            backdropFilter: 'blur(20px)',
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notification Details</Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip 
              label={notification.type} 
              color="primary" 
              size="small" 
              sx={{ fontWeight: 'bold' }} 
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={14} />
              {format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm:ss')}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 3, lineHeight: 1.8 }}>
            {notification.message}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChart2 size={18} />
            Priority Breakdown
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Base Score</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{(notification.priorityScore * 0.7).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Recency Multiplier</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>1.2x</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Final Score</Typography>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
              {notification.priorityScore.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<Copy size={18} />} onClick={handleCopy}>
          Copy
        </Button>
        <Button startIcon={<Share2 size={18} />}>
          Share
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          variant="contained" 
          onClick={() => {
            onMarkRead(notification.id);
            onClose();
          }}
        >
          Mark as Read
        </Button>
      </DialogActions>
    </Dialog>
  );
};
