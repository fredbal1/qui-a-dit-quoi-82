
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export const useCurrentPlayer = (gameId: string) => {
  const [player, setPlayer] = useState<Tables<'game_players'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchCurrentPlayer = async () => {
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
          .single();

        if (playerError) {
          throw playerError;
        }

        setPlayer(playerData);
      } catch (err: any) {
        console.error('Error fetching current player:', err);
        setError(err.message || 'Erreur lors du chargement du joueur');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlayer();

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
        () => {
          fetchCurrentPlayer();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playerChannel);
    };
  }, [gameId]);

  return { player, loading, error };
};
