// src/lib/toastService.ts
import { toast } from 'react-hot-toast';

const toastService = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) =>
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fff3cd',
        color: '#856404',
      },
    }),
  info: (message: string) =>
    toast(message, {
      icon: 'ℹ️',
    }),
};

export default toastService;
