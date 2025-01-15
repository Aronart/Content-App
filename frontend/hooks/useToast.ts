import toast from 'react-hot-toast';

interface ToastOptions {
  title: string;
  description?: string;
  status?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
}

export const useToast = () => {
  return (options: ToastOptions) => {
    const { title, description, status = 'info', duration = 3000 } = options;
    const message = description ? `${title}\n${description}` : title;

    switch (status) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      default:
        toast(message, { duration });
    }
  };
};
