interface ShowToastOptions {
  id: string;
  content: string;
  durationMs?: number;
}

interface ToastItem {
  id: string;
  content: string;
  durationMs: number;
}

interface ToastApi {
  show: (options: ShowToastOptions) => void;
  dismiss: (id: string) => void;
}

export type { ShowToastOptions, ToastApi, ToastItem };
