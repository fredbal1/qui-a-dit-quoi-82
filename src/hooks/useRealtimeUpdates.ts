
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = (gameId: string, onUpdate?: () => void) => {
  useEffect(() => {
    if (!gameId) return;

    console.log('Setting up realtime subscriptions for game:', gameId);

    const channel = supabase
      .channel('game-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          console.log('Game update:', payload);
          onUpdate?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('Player update:', payload);
          onUpdate?.();
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
          console.log('Answer update:', payload);
          onUpdate?.();
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
          console.log('Vote update:', payload);
          onUpdate?.();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(channel);
    };
  }, [gameId, onUpdate]);
};
