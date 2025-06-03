
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export const useCurrentPlayer = (gameId: string) => {
  const [player, setPlayer] = useState<Tables<'game_players'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const fetchCurrentPlayer = useCallback(async () => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data: playerData, error: playerError } = await supabase
        .from('game_players')
        .select('*')
        .eq('game_id', gameId)
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single

      if (playerError) {
        throw playerError;
      }

      setPlayer(playerData);
      setRetryCount(0);
    } catch (err: any) {
      console.error('Error fetching current player:', err);
      const errorMessage = err.message || 'Erreur lors du chargement du joueur';
      setError(errorMessage);

      // Auto-retry pour les erreurs réseau (max 2 fois)
      if (retryCount < 2 && err.message?.includes('Failed to fetch')) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchCurrentPlayer();
        }, 1000 * (retryCount + 1));
      } else if (retryCount >= 2) {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de charger vos informations",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, retryCount, toast]);

  useEffect(() => {
    fetchCurrentPlayer();

    if (!gameId) return;

    // Set up realtime subscription for player updates
    const playerChannel = supabase
      .channel('player-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('Player updated:', payload);
          fetchCurrentPlayer();
        }
      )
      .subscribe((status) => {
        console.log('Player channel status:', status);
      });

    return () => {
      supabase.removeChannel(playerChannel);
    };
  }, [fetchCurrentPlayer]);

  return { 
    player, 
    loading, 
    error,
    refetch: fetchCurrentPlayer,
    isRetrying: retryCount > 0
  };
};
