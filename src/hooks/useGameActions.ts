
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGameActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitAnswer = async (roundId: string, content: string, isBluff: boolean = false) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from('answers')
        .insert({
          player_id: user.id,
          round_id: roundId,
          content,
          is_bluff: isBluff,
          timestamp: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Réponse envoyée ! ✅",
        description: "Votre réponse a été soumise avec succès",
      });

      return { success: true };
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'envoyer la réponse",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (
    roundId: string, 
    targetPlayerId: string, 
    answerId: string, 
    voteType: string
  ) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Use upsert to handle "one vote per player per round" constraint
      const { error } = await supabase
        .from('votes')
        .upsert({
          player_id: user.id,
          round_id: roundId,
          target_player_id: targetPlayerId,
          answer_id: answerId,
          vote_type: voteType,
          timestamp: new Date().toISOString()
        }, {
          onConflict: 'player_id,round_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Vote enregistré ! 🗳️",
        description: "Votre vote a été pris en compte",
      });

      return { success: true };
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'enregistrer le vote",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const advancePhase = async (gameId: string) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Verify user is host (using optimized index on host)
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('host, phase, current_round, total_rounds')
        .eq('id', gameId)
        .single();

      if (gameError) {
        throw gameError;
      }

      if (gameData.host !== user.id) {
        throw new Error('Seul le créateur peut faire avancer la partie');
      }

      // Define phase progression
      const phaseOrder = ['intro', 'answer', 'vote', 'reveal', 'results'];
      const currentPhaseIndex = phaseOrder.indexOf(gameData.phase || 'intro');
      
      let nextPhase: string;
      let nextRound = gameData.current_round;

      if (currentPhaseIndex === phaseOrder.length - 1) {
        // From 'results', check if we should go to next round or end game
        if (gameData.current_round && gameData.current_round < (gameData.total_rounds || 5)) {
          nextPhase = 'intro';
          nextRound = (gameData.current_round || 1) + 1;
        } else {
          nextPhase = 'ended';
        }
      } else {
        nextPhase = phaseOrder[currentPhaseIndex + 1];
      }

      const updateData: any = { phase: nextPhase };
      if (nextRound !== gameData.current_round) {
        updateData.current_round = nextRound;
      }

      const { error: updateError } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', gameId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Phase avancée ! 🚀",
        description: `Passage à la phase: ${nextPhase}`,
      });

      return { success: true, nextPhase };
    } catch (err: any) {
      console.error('Error advancing phase:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de faire avancer la partie",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (settings: any = {}) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Generate 6-character game code
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          code: gameCode,
          host: user.id,
          settings: settings,
          status: 'waiting',
          current_round: 1,
          total_rounds: settings.totalRounds || 5,
          phase: 'intro'
        })
        .select()
        .single();

      if (gameError) {
        throw gameError;
      }

      // Add host as first player
      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          is_host: true,
          score: 0,
          coins: 0,
          level: 1,
          xp: 0
        });

      if (playerError) {
        throw playerError;
      }

      toast({
        title: "Partie créée ! 🎉",
        description: `Code de la partie: ${gameCode}`,
      });

      return { success: true, gameCode, gameId: gameData.id };
    } catch (err: any) {
      console.error('Error creating game:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer la partie",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAnswer,
    submitVote,
    advancePhase,
    createGame,
    loading
  };
};
