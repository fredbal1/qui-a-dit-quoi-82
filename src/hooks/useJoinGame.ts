
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useJoinGame = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinGame = async (gameCode: string) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Check if game exists and is joinable (using optimized index on code)
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id, status, code')
        .eq('code', gameCode.toUpperCase())
        .single();

      if (gameError) {
        throw new Error('Partie non trouvée');
      }

      if (gameData.status !== 'waiting') {
        throw new Error('Cette partie a déjà commencé');
      }

      // Check if user is already in the game (using optimized composite index)
      const { data: existingPlayer } = await supabase
        .from('game_players')
        .select('id')
        .eq('game_id', gameData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingPlayer) {
        // User already in game, just return success
        return { success: true, gameCode: gameData.code };
      }

      // Add player to game
      const { error: joinError } = await supabase
        .from('game_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          is_host: false,
          score: 0,
          coins: 0,
          level: 1,
          xp: 0
        });

      if (joinError) {
        throw joinError;
      }

      toast({
        title: "Partie rejointe ! 🎉",
        description: `Vous avez rejoint la partie ${gameCode}`,
      });

      return { success: true, gameCode: gameData.code };
    } catch (err: any) {
      console.error('Error joining game:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de rejoindre la partie",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { joinGame, loading };
};
