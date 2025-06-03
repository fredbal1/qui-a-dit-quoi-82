
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorEvent {
  type: 'game_action' | 'realtime' | 'auth' | 'network';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

export const useErrorMonitoring = () => {
  const { toast } = useToast();

  const logError = (error: ErrorEvent) => {
    // Log to console for development
    console.error('[KIADISA Error]', error);

    // Dans un environnement de production, envoyer à Sentry ou LogSnag
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(new Error(error.message), {
    //     tags: { type: error.type },
    //     extra: error.context
    //   });
    // }

    // Afficher un toast d'erreur pour l'utilisateur
    if (error.type === 'network') {
      toast({
        title: "Problème de connexion",
        description: "Vérifiez votre connexion internet",
        variant: "destructive"
      });
    } else if (error.type === 'game_action') {
      toast({
        title: "Action impossible",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const logEvent = (eventType: string, data?: Record<string, any>) => {
    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id' // À récupérer depuis useAuth
    };

    console.log('[KIADISA Event]', event);

    // Dans un environnement de production :
    // LogSnag.track({
    //   channel: 'game-events',
    //   event: eventType,
    //   description: `User performed ${eventType}`,
    //   icon: '🎮',
    //   notify: false,
    //   tags: data
    // });
  };

  useEffect(() => {
    // Capturer les erreurs JavaScript non gérées
    const handleError = (event: ErrorEvent) => {
      logError({
        type: 'network',
        message: event.message || 'Erreur inconnue',
        context: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        timestamp: new Date().toISOString()
      });
    };

    // Capturer les promesses rejetées non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError({
        type: 'network',
        message: 'Promise rejetée non gérée',
        context: { reason: event.reason },
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return { logError, logEvent };
};
