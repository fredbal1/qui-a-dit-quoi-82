
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import GlassCard from '@/components/GlassCard';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface LoadingWithFallbackProps {
  isLoading: boolean;
  error?: string | null;
  isRetrying?: boolean;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  showSkeleton?: boolean;
}

const LoadingWithFallback: React.FC<LoadingWithFallbackProps> = ({
  isLoading,
  error,
  isRetrying = false,
  children,
  loadingMessage = "Chargement...",
  errorMessage,
  showSkeleton = false
}) => {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 5000); // Show warning after 5 seconds

      return () => {
        clearTimeout(timer);
        setShowSlowWarning(false);
      };
    }
  }, [isLoading]);

  if (error && !isRetrying) {
    return (
      <GlassCard className="text-center bg-red-500/20 border-red-300/30">
        <div className="flex items-center justify-center mb-3">
          <WifiOff className="w-6 h-6 text-red-400 mr-2" />
          <span className="text-red-200 font-inter">
            {errorMessage || error}
          </span>
        </div>
      </GlassCard>
    );
  }

  if (isLoading) {
    if (showSkeleton) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full bg-white/20" />
          <Skeleton className="h-16 w-full bg-white/20" />
          <Skeleton className="h-12 w-3/4 bg-white/20" />
        </div>
      );
    }

    return (
      <GlassCard className="text-center">
        <div className="flex items-center justify-center mb-3">
          {isRetrying ? (
            <WifiOff className="w-6 h-6 text-yellow-400 mr-2 animate-pulse" />
          ) : (
            <Loader2 className="w-6 h-6 text-white mr-2 animate-spin" />
          )}
          <span className="text-white font-inter">
            {isRetrying ? 'Reconnexion...' : loadingMessage}
          </span>
        </div>
        
        {showSlowWarning && (
          <p className="text-white/60 text-sm font-inter mt-2">
            {isRetrying ? 
              '📶 Vérification de la connexion...' : 
              '⏱️ Le chargement prend plus de temps que prévu'
            }
          </p>
        )}
      </GlassCard>
    );
  }

  return <>{children}</>;
};

export default LoadingWithFallback;
