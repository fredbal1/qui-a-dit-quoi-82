
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type GameWithDetails = Tables<'games'> & {
  game_players: (Tables<'game_players'> & {
    profiles: Pick<Tables<'profiles'>, 'pseudo' | 'avatar'>
  })[];
  current_round_data?: Tables<'rounds'>;
  answers?: Tables<'answers'>[];
  votes?: Tables<'votes'>[];
};

export const useGameData = (gameCode: string) => {
  const [gameData, setGameData] = useState<GameWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGameData = useCallback(async () => {
    if (!gameCode) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch game with optimized query using the new indexes
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select(`
          *,
          game_players!inner (
            *,
            profiles!inner (
              pseudo,
              avatar
            )
          )
        `)
        .eq('code', gameCode)
        .single();

      if (gameError) {
        throw gameError;
      }

      let enrichedGameData = { ...gameData };

      // Fetch current round data if exists
      if (gameData.current_round) {
        const { data: roundData } = await supabase
          .from('rounds')
          .select('*')
          .eq('game_id', gameData.id)
          .eq('round_number', gameData.current_round)
          .maybeSingle();

        if (roundData) {
          enrichedGameData.current_round_data = roundData;

          // Fetch answers for current round
          const { data: answersData } = await supabase
            .from('answers')
            .select('*')
            .eq('round_id', roundData.id);

          // Fetch votes for current round
          const { data: votesData } = await supabase
            .from('votes')
            .select('*')
            .eq('round_id', roundData.id);

          enrichedGameData.answers = answersData || [];
          enrichedGameData.votes = votesData || [];
        }
      }

      setGameData(enrichedGameData);
    } catch (err: any) {
      console.error('Error fetching game data:', err);
      setError(err.message || 'Erreur lors du chargement de la partie');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la partie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [gameCode, toast]);

  useEffect(() => {
    fetchGameData();

    if (!gameCode) return;

    // Set up optimized realtime subscriptions
    const gameChannel = supabase
      .channel('game-data-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `code=eq.${gameCode}`
        },
        () => {
          console.log('Game updated, refetching data');
          fetchGameData();
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
          console.log('Player updated:', payload);
          fetchGameData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answers'
        },
        (payload) => {
          console.log('Answer updated:', payload);
          fetchGameData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          console.log('Vote updated:', payload);
          fetchGameData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [fetchGameData]);

  return { 
    gameData, 
    loading, 
    error, 
    refetch: fetchGameData 
  };
};
