import { cn } from "cnfast";

export const Button = ({ children, ...props }) => (
  <button
    type="button"
    class={cn(
      "rounded-sm cursor-pointer bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300",
      "hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20",
    )}
    {...props}
  >
    {children}
  </button>
);
