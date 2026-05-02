"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Typography, Box, Grid, Slider, Paper, alpha, 
  useTheme, Stack, Chip, Tooltip, IconButton
} from '@mui/material';
import { 
  Info, Trophy, Medal, Star, Filter, 
  ChevronUp, ChevronDown, RefreshCw 
} from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import { Notification } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Log } from 'logging_middleware';

export default function PriorityInboxPage() {
  const { notifications, loading, viewedIds, markAsRead, refresh } = useNotificationsContext();
  const [n, setN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const theme = useTheme();

  useEffect(() => {
    Log("frontend", "info", "page", `Priority inbox loaded with N=${n}`);
  }, [n]);

  const topN = useMemo(() => {
    let result = [...notifications]
      .sort((a, b) => b.priorityScore - a.priorityScore);

    if (typeFilter !== 'All') {
      result = result.filter(n => n.type === typeFilter);
    }

    return result.slice(0, n);
  }, [notifications, n, typeFilter]);

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: <Trophy size={20} color="#fbbf24" />, label: "#1 GOLD", color: "#fbbf24" };
    if (index === 1) return { icon: <Medal size={20} color="#94a3b8" />, label: "#2 SILVER", color: "#94a3b8" };
    if (index === 2) return { icon: <Star size={20} color="#b45309" />, label: "#3 BRONZE", color: "#b45309" };
    return { icon: null, label: `#${index + 1}`, color: theme.palette.text.secondary };
  };

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Priority Inbox</Typography>
        <Paper 
          sx={{ 
            p: 4, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 4,
            mb: 4
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Top-N Intelligent Ranking</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                Our algorithm analyzes base priority, recency, and impact to show you the most critical updates first.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>SHOW TOP {n} NOTIFICATIONS</Typography>
                  <Slider
                    value={n}
                    min={5}
                    max={50}
                    step={5}
                    onChange={(e, v) => setN(v as number)}
                    valueLabelDisplay="auto"
                    sx={{ color: 'white' }}
                  />
                </Box>
                <Typography variant="h2" sx={{ fontWeight: 900 }}>{n}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: alpha('#fff', 0.1), borderRadius: 3, backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info size={18} />
                  How it works
                </Typography>
                <Typography variant="caption" component="p" sx={{ opacity: 0.8 }}>
                  Score = (Base Priority × 0.6) + (Recency × 0.3) + (Impact × 0.1)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {['All', 'Placement', 'Result', 'Event'].map((type) => (
          <Chip
            key={type}
            label={type}
            onClick={() => setTypeFilter(type)}
            color={typeFilter === type ? "primary" : "default"}
            variant={typeFilter === type ? "filled" : "outlined"}
            sx={{ fontWeight: 600, px: 2, height: 40 }}
          />
        ))}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {topN.map((notification, index) => {
            const badge = getRankBadge(index);
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: { xs: 'none', lg: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      zIndex: 1
                    }}
                  >
                    {badge.icon}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 900, 
                        color: badge.color,
                        writingMode: 'vertical-rl',
                        textTransform: 'uppercase'
                      }}
                    >
                      {badge.label}
                    </Typography>
                  </Box>
                  
                  <NotificationCard
                    notification={notification}
                    isNew={!viewedIds.has(notification.id)}
                    onClick={setSelectedNotification}
                  />

                  <Tooltip title="Why is this priority? Our algorithm detected high urgency based on the notification type and content keywords.">
                    <IconButton 
                      size="small" 
                      sx={{ position: 'absolute', right: 10, top: 10, color: 'text.secondary', opacity: 0.5 }}
                    >
                      <Info size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      <NotificationModal 
        notification={selectedNotification} 
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
      />
    </Box>
  );
}
