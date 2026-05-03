type ToastKind = 'success' | 'error' | 'info';

export type AppToast = {
  id: string;
  kind: ToastKind;
  message: string;
};

const TOAST_TIMEOUT_MS = 3200;

export const useToast = () => {
  const toasts = useState<AppToast[]>('app_toasts', () => []);

  const dismissToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const pushToast = (kind: ToastKind, message: string) => {
    const id = crypto.randomUUID();
    toasts.value = [...toasts.value, { id, kind, message }];
    setTimeout(() => dismissToast(id), TOAST_TIMEOUT_MS);
  };

  return {
    toasts,
    dismissToast,
    pushToast
  };
};
