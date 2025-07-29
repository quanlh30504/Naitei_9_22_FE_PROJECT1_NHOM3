import { type ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { type ButtonProps, Button } from "@/Components/ui/button"; 
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonProps {
  loading?: boolean; 
  loadingText?: string;
  children: ReactNode; 
  className?: string; 
}

export default function ActionButton({
  children,
  loading = false, 
  loadingText = "Đang xử lý...",
  className,
  ...rest // props còn lại của Button (variant, size, type, asChild,...)
}: ActionButtonProps) {
  return (
    <Button
      className={cn("flex items-center justify-center", className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
