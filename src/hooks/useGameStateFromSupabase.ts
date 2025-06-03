
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type GameWithPlayers = Tables<'games'> & {
  game_players: Tables<'game_players'>[];
  current_round_data?: Tables<'rounds'>;
};

export const useGameStateFromSupabase = (gameCode: string) => {
  const [gameState, setGameState] = useState<GameWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameCode) return;

    const fetchGameState = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch game with players and current round
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select(`
            *,
            game_players (*),
            rounds!inner (*)
          `)
          .eq('code', gameCode)
          .eq('rounds.round_number', supabase.raw('games.current_round'))
          .single();

        if (gameError) {
          throw gameError;
        }

        setGameState(gameData as GameWithPlayers);
      } catch (err: any) {
        console.error('Error fetching game state:', err);
        setError(err.message || 'Erreur lors du chargement de la partie');
      } finally {
        setLoading(false);
      }
    };

    fetchGameState();

    // Set up realtime subscriptions
    const gameChannel = supabase
      .channel('game-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `code=eq.${gameCode}`
        },
        () => {
          fetchGameState();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players'
        },
        () => {
          fetchGameState();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rounds'
        },
        () => {
          fetchGameState();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [gameCode]);

  return { gameState, loading, error, refetch: () => fetchGameState() };
};
