
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type GameWithPlayers = Tables<'games'> & {
  game_players: Tables<'game_players'>[];
  current_round_data?: Tables<'rounds'>;
};

export const useGameStateFromSupabase = (gameCode: string) => {
  const [gameState, setGameState] = useState<GameWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const fetchGameState = useCallback(async () => {
    if (!gameCode) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Timeout pour éviter les requêtes qui traînent
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      const fetchPromise = async () => {
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

        return {
          ...gameData,
          game_players: playersData || [],
          current_round_data: currentRoundData
        };
      };

      const result = await Promise.race([fetchPromise(), timeoutPromise]) as GameWithPlayers;
      setGameState(result);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching game state:', err);
      const errorMessage = err.message || 'Erreur lors du chargement de la partie';
      setError(errorMessage);

      // Auto-retry pour les erreurs réseau (max 3 fois)
      if (retryCount < 3 && (err.message?.includes('Failed to fetch') || err.message?.includes('Timeout'))) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchGameState();
        }, delay);
      } else if (retryCount >= 3) {
        toast({
          title: "Problème de connexion",
          description: "Vérifiez votre connexion internet",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [gameCode, retryCount, toast]);

  useEffect(() => {
    fetchGameState();

    if (!gameCode) return;

    // Set up realtime subscriptions avec gestion d'erreurs
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
        (payload) => {
          console.log('Game updated:', payload);
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
        (payload) => {
          console.log('Players updated:', payload);
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
        (payload) => {
          console.log('Rounds updated:', payload);
          fetchGameState();
        }
      )
      .subscribe((status) => {
        console.log('Channel status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime channel error');
          // Fallback: poll every 5 seconds if realtime fails
          const pollInterval = setInterval(fetchGameState, 5000);
          return () => clearInterval(pollInterval);
        }
      });

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [fetchGameState]);

  return { 
    gameState, 
    loading, 
    error, 
    refetch: fetchGameState,
    isRetrying: retryCount > 0
  };
};
