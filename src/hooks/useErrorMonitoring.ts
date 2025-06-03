
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AppErrorEvent {
  type: 'game_action' | 'realtime' | 'auth' | 'network';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

export const useErrorMonitoring = () => {
  const { toast } = useToast();

  const logError = (error: AppErrorEvent) => {
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
    const handleError = (event: Event) => {
      const errorEvent = event as any; // Type assertion pour accéder aux propriétés
      logError({
        type: 'network',
        message: errorEvent.message || 'Erreur inconnue',
        context: { 
          filename: errorEvent.filename,
          lineno: errorEvent.lineno,
          colno: errorEvent.colno
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
