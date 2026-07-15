export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  severity: ToastSeverity;
  /** ms before auto-dismiss. Omit/0 for "loading" toasts that need a manual dismiss(). */
  duration?: number;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l(toasts));
}

function push(item: Omit<ToastItem, "id">): string {
  const id = crypto.randomUUID();
  toasts = [...toasts, { ...item, id }];
  emit();

  if (item.duration !== 0) {
    setTimeout(() => dismiss(id), item.duration ?? 4000);
  }
  return id;
}

export function dismiss(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  emit();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot() {
  return toasts;
}

/**
 * Usage anywhere in the app (Toaster is mounted once in
 * components/providers.tsx — no per-page setup needed):
 *
 *   import { toast } from "@/components/ui/toast";
 *   toast.success("Prescription sent to pharmacy");
 *   toast.error("Failed to save vitals");
 *   toast.warning("Medicine out of stock");
 *   const id = toast.loading("Saving...");
 *   toast.dismiss(id);
 */
export const toast = {
  success: (message: string, description?: string) =>
    push({ message, description, severity: "success" }),
  error: (message: string, description?: string) =>
    push({ message, description, severity: "error" }),
  info: (message: string, description?: string) =>
    push({ message, description, severity: "info" }),
  warning: (message: string, description?: string) =>
    push({ message, description, severity: "warning" }),
  loading: (message: string) => push({ message, severity: "info", duration: 0 }),
  dismiss,
};
