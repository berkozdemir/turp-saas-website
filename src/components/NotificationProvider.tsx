import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    success: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => void;
    error: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => void;
    warning: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => void;
    info: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

// Notification styles by type
const notificationStyles: Record<NotificationType, { bg: string; border: string; icon: React.ReactNode }> = {
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircle className="text-green-600" size={20} />
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <XCircle className="text-red-600" size={20} />
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <AlertTriangle className="text-amber-600" size={20} />
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: <Info className="text-blue-600" size={20} />
    }
};

// Single notification component
const NotificationItem = ({
    notification,
    onClose
}: {
    notification: Notification;
    onClose: () => void;
}) => {
    const style = notificationStyles[notification.type];

    React.useEffect(() => {
        const duration = notification.duration ?? (notification.type === 'error' ? 6000 : 4000);
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [notification, onClose]);

    return (
        <div
            role={notification.type === 'error' ? 'alert' : 'status'}
            aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
            className={`${style.bg} ${style.border} border rounded-xl p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-[420px] animate-in slide-in-from-right fade-in duration-300`}
        >
            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
            <div className="flex-1 min-w-0">
                {notification.title && (
                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">{notification.title}</h4>
                )}
                <p className="text-slate-700 text-sm">{notification.message}</p>
                {notification.action && (
                    <button
                        onClick={notification.action.onClick}
                        className="mt-2 text-sm font-medium text-rose-600 hover:text-rose-700 underline"
                    >
                        {notification.action.label}
                    </button>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Bildirimi kapat"
            >
                <X size={16} className="text-slate-400" />
            </button>
        </div>
    );
};

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setNotifications(prev => [...prev, { ...notification, id }]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const success = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
        addNotification({ type: 'success', message, ...options });
    }, [addNotification]);

    const error = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
        addNotification({ type: 'error', message, ...options });
    }, [addNotification]);

    const warning = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
        addNotification({ type: 'warning', message, ...options });
    }, [addNotification]);

    const info = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
        addNotification({ type: 'info', message, ...options });
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            removeNotification,
            success,
            error,
            warning,
            info
        }}>
            {children}
            {/* Notification container - fixed position top-right */}
            <div
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
                aria-label="Bildirimler"
            >
                {notifications.map(notification => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationItem
                            notification={notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
