interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = "Chargement des données...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}
