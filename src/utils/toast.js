let notify = null;

export const registerToast = (fn) => {
  notify = fn;
};

const toast = {
  success: (message, duration) => {
    notify?.(message, "success", duration);
  },
  error: (message, duration) => {
    notify?.(message, "error", duration);
  },
  info: (message, duration) => {
    notify?.(message, "info", duration);
  },
  warning: (message, duration) => {
    notify?.(message, "warning", duration);
  },
};

export default toast;