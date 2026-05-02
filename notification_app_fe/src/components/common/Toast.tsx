"use client";

import React from 'react';
import { Snackbar, Alert, AlertProps, Slide } from '@mui/material';

interface ToastProps {
  open: boolean;
  message: string;
  severity?: AlertProps['severity'];
  onClose: () => void;
}

function TransitionLeft(props: any) {
  return <Slide {...props} direction="left" />;
}

export const Toast: React.FC<ToastProps> = ({ open, message, severity = 'success', onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={TransitionLeft}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        variant="filled"
        sx={{ 
          width: '100%', 
          borderRadius: 3, 
          fontWeight: 600,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
