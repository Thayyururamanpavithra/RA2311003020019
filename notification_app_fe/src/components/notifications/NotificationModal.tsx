"use client";

import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Chip, alpha, useTheme,
  IconButton, Divider, Tooltip
} from '@mui/material';
import { 
  X, Share2, Copy, Calendar, Clock, BarChart2,
  ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import { Notification } from '@/types';
import { format } from 'date-fns';
import { Log } from 'logging_middleware';

interface NotificationModalProps {
  notification: Notification | null;
  allNotifications?: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onNavigate?: (notification: Notification) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ 
  notification, 
  allNotifications = [], 
  onClose, 
  onMarkRead,
  onNavigate
}) => {
  const theme = useTheme();

  if (!notification) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(notification.message);
    Log("frontend", "info", "component", `Notification content copied to clipboard`);
  };

  const currentIndex = allNotifications.findIndex(n => n.id === notification.id);
  const hasNext = currentIndex !== -1 && currentIndex < allNotifications.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(allNotifications[currentIndex + 1]);
      Log("frontend", "debug", "component", "Navigated to next notification in modal");
    }
  };

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(allNotifications[currentIndex - 1]);
      Log("frontend", "debug", "component", "Navigated to previous notification in modal");
    }
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
            borderRadius: 6,
            background: theme.palette.mode === 'dark' ? alpha('#0f172a', 0.8) : alpha('#ffffff', 0.9),
            backdropFilter: 'blur(30px)',
            backgroundImage: 'none',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }
        }
      }}
    >
      <DialogTitle component="div" sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Notification Details</Typography>
          <Typography variant="caption" color="text.secondary">ID: {notification.id}</Typography>
        </Box>
        <Box>
          <IconButton onClick={handlePrev} disabled={!hasPrev} size="small" sx={{ mr: 1 }}>
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton onClick={handleNext} disabled={!hasNext} size="small" sx={{ mr: 2 }}>
            <ChevronRight size={20} />
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Chip 
              label={notification.type} 
              color={notification.type === 'Placement' ? 'success' : notification.type === 'Result' ? 'primary' : 'warning'}
              size="small" 
              sx={{ fontWeight: 800, px: 1 }} 
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <Calendar size={14} />
              {format(new Date(notification.timestamp), 'PPP')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <Clock size={14} />
              {format(new Date(notification.timestamp), 'p')}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
            {notification.message}
          </Typography>

          <Divider sx={{ mb: 4, opacity: 0.5 }} />

          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 4, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
            <Typography variant="subtitle2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800 }}>
              <BarChart2 size={18} color={theme.palette.primary.main} />
              Smart Priority Analysis
              <Tooltip title="Priority score is calculated based on type weight, recency, and urgency keywords.">
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <Info size={14} />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Base Weight ({notification.type})</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {notification.type === 'Placement' ? '300' : notification.type === 'Result' ? '200' : '100'} pts
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Recency Bonus</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                  +{Math.max(0, (notification.priorityScore || 0) - (notification.type === 'Placement' ? 300 : notification.type === 'Result' ? 200 : 100)).toFixed(0)} pts
                </Typography>
              </Box>
              <Box sx={{ pt: 1, mt: 1, borderTop: `1px dashed ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Total Priority Score</Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 900 }}>
                  {notification.priorityScore?.toFixed(0) || '0'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.5), gap: 1 }}>
        <Button startIcon={<Copy size={18} />} onClick={handleCopy} variant="outlined" sx={{ borderRadius: 3 }}>
          Copy
        </Button>
        <Button startIcon={<Share2 size={18} />} variant="outlined" sx={{ borderRadius: 3 }}>
          Share
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          variant="contained" 
          size="large"
          sx={{ borderRadius: 3, px: 4 }}
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
