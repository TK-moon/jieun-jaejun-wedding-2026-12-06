import { createContext, useState, type FC, type PropsWithChildren } from 'react';
import { useTimeout } from '../../hooks/useTimeout';
import type { ShowToastOptions, ToastApi, ToastItem } from './_types';
import { createToastItem, removeToast, upsertToast } from './_utils';

interface ToastContextValue extends ToastApi {
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface Props extends PropsWithChildren {}

const ToastProvider: FC<Props> = (props) => {
  const { children } = props;
  const [toastsById, setToastsById] = useState(() => new Map<string, ToastItem>());
  const timeout = useTimeout();

  const dismiss = (id: string) => {
    timeout.clear(id);
    setToastsById((current) => removeToast(current, id));
  };

  const show = (options: ShowToastOptions) => {
    const toast = createToastItem(options);

    setToastsById((current) => upsertToast(current, toast));
    timeout.set(toast.id, () => dismiss(toast.id), toast.durationMs);
  };

  return (
    <ToastContext.Provider
      value={{
        toasts: [...toastsById.values()],
        show,
        dismiss,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
