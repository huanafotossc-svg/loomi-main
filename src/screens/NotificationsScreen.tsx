import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MessageCircle, CheckCircle, Star, Bell } from 'lucide-react';
import { Header, EmptyNotifications } from '../components';
import { mockNotifications } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { cn, formatRelativeTime } from '../utils/helpers';
import type { NotificationType } from '../types';

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  // Get user notifications
  const notifications = mockNotifications.filter(n => n.userId === user?.id);
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'application':
        return <CheckCircle className="w-5 h-5" />;
      case 'approval':
        return <Star className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'job':
        return 'bg-blue-100 text-blue-600';
      case 'message':
        return 'bg-green-100 text-green-600';
      case 'application':
        return 'bg-coral/15 text-coral';
      case 'approval':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-warm-gray-100 text-warm-gray-600';
    }
  };

  const filters: { value: NotificationType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'job', label: 'Vagas' },
    { value: 'message', label: 'Mensagens' },
    { value: 'application', label: 'Candidaturas' },
    { value: 'approval', label: 'Aprovações' },
  ];

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      <Header
        title="Notificações"
        subtitle={`${notifications.filter(n => !n.isRead).length} não lidas`}
        showBack
      />

      {/* Filters */}
      <div className="px-4 py-2 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {filters.map((f) => (
            <motion.button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors',
                filter === f.value
                  ? 'bg-coral text-white'
                  : 'bg-white text-warm-gray-600 border border-warm-gray-200'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 pt-4">
        {filteredNotifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => (
              <motion.button
                key={notification.id}
                onClick={() => {
                  if (notification.data?.jobId) {
                    navigate(`/job/${notification.data.jobId}`);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-colors',
                  notification.isRead ? 'bg-white' : 'bg-coral/5'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  getIconColor(notification.type)
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      'font-medium text-ink',
                      !notification.isRead && 'font-semibold'
                    )}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-warm-gray-400 flex-shrink-0">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-warm-gray-500 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="w-2.5 h-2.5 bg-coral rounded-full flex-shrink-0 mt-1" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
