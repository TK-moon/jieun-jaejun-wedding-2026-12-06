import type { ReactNode } from 'react';

interface ShowToastOptions {
  id: string;
  content: string;
  icon?: ReactNode;
  durationMs?: number;
}

interface ToastItem {
  id: string;
  content: string;
  icon?: ReactNode;
  durationMs: number;
}

interface ToastApi {
  show: (options: ShowToastOptions) => void;
  dismiss: (id: string) => void;
}

export type { ShowToastOptions, ToastApi, ToastItem };
