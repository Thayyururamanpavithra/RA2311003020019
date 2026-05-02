"use client";

import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '12px',
              bgcolor: alpha(color, 0.1),
              color: color,
              mr: 3,
            }}
          >
            <Icon size={28} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: delay + 0.5 }}
              >
                {value}
              </motion.span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
