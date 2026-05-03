type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
};

const defaultState = (): ConfirmState => ({
  open: false,
  title: '',
  message: '',
  confirmLabel: '',
  cancelLabel: ''
});

export const useConfirm = () => {
  const dialog = useState<ConfirmState>('app_confirm_dialog', defaultState);
  const resolver = useState<((value: boolean) => void) | null>('app_confirm_resolver', () => null);

  const close = (value: boolean) => {
    resolver.value?.(value);
    resolver.value = null;
    dialog.value = defaultState();
  };

  const confirm = (options: Omit<ConfirmState, 'open'>) =>
    new Promise<boolean>((resolve) => {
      resolver.value = resolve;
      dialog.value = {
        open: true,
        ...options
      };
    });

  return {
    dialog,
    confirm,
    close
  };
};
