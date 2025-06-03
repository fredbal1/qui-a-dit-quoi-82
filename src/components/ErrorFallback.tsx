
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AnimatedBackground from '@/components/AnimatedBackground';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isDev = import.meta.env.DEV;

  return (
    <AnimatedBackground variant="error">
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md text-center">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-poppins font-bold text-white mb-2">
              Oups ! Une erreur s'est produite
            </h2>
            <p className="text-white/80 font-inter">
              Ne t'inquiète pas, on va arranger ça !
            </p>
          </div>

          {isDev && (
            <div className="mb-6 p-3 bg-red-500/20 rounded-lg border border-red-300/30">
              <p className="text-red-200 text-sm font-mono">
                {error.message}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={resetError}
              className="w-full bg-white/20 border-white/50 text-white hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="ghost"
              className="w-full text-white/80 hover:text-white hover:bg-white/10"
            >
              Retour au dashboard
            </Button>
          </div>
        </GlassCard>
      </div>
    </AnimatedBackground>
  );
};

export default ErrorFallback;
