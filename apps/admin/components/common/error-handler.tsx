import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

interface ErrorHandlerProps {
  error: ErrorResponse | string | null;
  variant?: "error" | "warning" | "info";
  title?: string;
}

export default function ErrorHandler({
  error,
  variant = "error",
  title,
}: ErrorHandlerProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.error;
  const errorCode = typeof error === "string" ? undefined : error.code;

  const getIcon = () => {
    switch (variant) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (variant) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
    }
  };

  const getClassName = () => {
    switch (variant) {
      case "error":
        return undefined;
      case "warning":
        return "bg-warning/10 text-warning-foreground border-warning";
      case "info":
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <Alert variant={getVariant()} className={getClassName()}>
      <div className="flex items-center gap-2">
        {getIcon()}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {errorMessage}
          {errorCode && (
            <span className="text-xs ml-2 opacity-70">(Code: {errorCode})</span>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
