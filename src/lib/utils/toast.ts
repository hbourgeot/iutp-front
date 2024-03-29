import { toastStore, type ToastSettings } from "@skeletonlabs/skeleton";

export const triggerToast = (title: string, timeout?: number) => {
  const t: ToastSettings = {
    message: title,
    timeout: timeout ?? 3000,
    background: 'variant-filled-primary'
  };

  toastStore.trigger(t);
};
