
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null
  });
  const { toast } = useToast();

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  const captureError = useCallback((error: Error, errorInfo?: string) => {
    console.error('[Error Boundary]', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo: errorInfo || error.message
    });

    // Toast utilisateur avec message simplifié
    toast({
      title: "Une erreur s'est produite",
      description: "L'application va se relancer automatiquement",
      variant: "destructive"
    });

    // Auto-reset après 3 secondes
    setTimeout(() => {
      resetError();
    }, 3000);
  }, [toast, resetError]);

  return {
    ...errorState,
    captureError,
    resetError
  };
};
