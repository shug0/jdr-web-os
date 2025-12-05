import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    toast: (options: string | { title?: string; description?: string; variant?: "destructive" | "success" | "warning" | "default" }) => {
      if (typeof options === "string") {
        return sonnerToast(options);
      }
      const toastOptions: { description?: string } = {};
      if (options.description) toastOptions.description = options.description;
      
      if (options.variant === "destructive") {
        return options.title ? sonnerToast.error(options.title, toastOptions) : sonnerToast.error(options.description || "");
      }
      if (options.variant === "success") {
        return options.title ? sonnerToast.success(options.title, toastOptions) : sonnerToast.success(options.description || "");
      }
      if (options.variant === "warning") {
        return options.title ? sonnerToast.warning(options.title, toastOptions) : sonnerToast.warning(options.description || "");
      }
      
      if (options.title && options.description) {
        return sonnerToast(options.title, { description: options.description });
      }
      if (options.title) {
        return sonnerToast(options.title);
      }
      return sonnerToast(options.description || "");
    },
    dismiss: sonnerToast.dismiss,
  };
}

export { sonnerToast as toast };
