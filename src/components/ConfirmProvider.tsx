import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context.confirm;
};

interface ConfirmState extends ConfirmOptions {
    isOpen: boolean;
    resolve: ((value: boolean) => void) | null;
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        message: '',
        resolve: null
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise(resolve => {
            setState({
                isOpen: true,
                ...options,
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        state.resolve?.(true);
        setState(prev => ({ ...prev, isOpen: false, resolve: null }));
    };

    const handleCancel = () => {
        state.resolve?.(false);
        setState(prev => ({ ...prev, isOpen: false, resolve: null }));
    };

    const typeStyles = {
        danger: {
            bg: 'bg-red-600 hover:bg-red-700',
            icon: 'text-red-600'
        },
        warning: {
            bg: 'bg-amber-600 hover:bg-amber-700',
            icon: 'text-amber-600'
        },
        info: {
            bg: 'bg-blue-600 hover:bg-blue-700',
            icon: 'text-blue-600'
        }
    };

    const currentType = state.type || 'danger';
    const styles = typeStyles[currentType];

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Modal Overlay */}
            {state.isOpen && (
                <div
                    className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-title"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
                        {/* Header */}
                        <div className="p-6 pb-0">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full bg-red-50 ${styles.icon}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex-1">
                                    {state.title && (
                                        <h3 id="confirm-title" className="text-lg font-bold text-slate-900 mb-1">
                                            {state.title}
                                        </h3>
                                    )}
                                    <p className="text-slate-600">{state.message}</p>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                    aria-label="Kapat"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                {state.cancelLabel || 'İptal'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 text-white font-medium rounded-xl transition-colors ${styles.bg}`}
                            >
                                {state.confirmLabel || 'Onayla'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export default ConfirmProvider;
