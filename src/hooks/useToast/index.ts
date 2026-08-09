import { useContext } from 'react';
import { ToastContext } from '../../components/Toast/ToastProvider';
import type { ToastApi } from '../../components/Toast/_types';

const useToast = (): ToastApi => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { show, dismiss } = context;

  return { show, dismiss };
};

export { useToast };
