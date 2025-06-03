
import { useState, useEffect, useCallback } from 'react';
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

  const fetchGameState = useCallback(async () => {
    if (!gameCode) return;

    try {
      setLoading(true);
      setError(null);

      // First fetch the game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('code', gameCode)
        .single();

      if (gameError) {
        throw gameError;
      }

      // Then fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('game_players')
        .select('*')
        .eq('game_id', gameData.id);

      if (playersError) {
        throw playersError;
      }

      // Fetch current round if exists
      let currentRoundData = null;
      if (gameData.current_round) {
        const { data: roundData, error: roundError } = await supabase
          .from('rounds')
          .select('*')
          .eq('game_id', gameData.id)
          .eq('round_number', gameData.current_round)
          .maybeSingle();

        if (!roundError && roundData) {
          currentRoundData = roundData;
        }
      }

      // Combine the data
      const combinedGameState: GameWithPlayers = {
        ...gameData,
        game_players: playersData || [],
        current_round_data: currentRoundData
      };

      setGameState(combinedGameState);
    } catch (err: any) {
      console.error('Error fetching game state:', err);
      setError(err.message || 'Erreur lors du chargement de la partie');
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  useEffect(() => {
    fetchGameState();

    if (!gameCode) return;

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
  }, [fetchGameState]);

  return { gameState, loading, error, refetch: fetchGameState };
};
