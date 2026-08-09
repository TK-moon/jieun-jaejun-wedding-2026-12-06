import { DEFAULT_TOAST_DURATION_MS } from '../_constants';
import type { ShowToastOptions, ToastItem } from '../_types';

const createToastItem = (options: ShowToastOptions): ToastItem => {
  const { id, content, durationMs = DEFAULT_TOAST_DURATION_MS } = options;

  return { id, content, durationMs };
};

const isSameToast = (left: ToastItem, right: ToastItem): boolean => {
  return left.content === right.content && left.durationMs === right.durationMs;
};

const upsertToast = (
  toasts: Map<string, ToastItem>,
  toast: ToastItem,
): Map<string, ToastItem> => {
  const existing = toasts.get(toast.id);
  if (existing && isSameToast(existing, toast)) {
    return toasts;
  }

  return new Map(toasts).set(toast.id, toast);
};

const removeToast = (toasts: Map<string, ToastItem>, id: string): Map<string, ToastItem> => {
  if (!toasts.has(id)) {
    return toasts;
  }

  const next = new Map(toasts);
  next.delete(id);
  return next;
};

export { createToastItem, removeToast, upsertToast };
