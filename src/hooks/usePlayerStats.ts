
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export const usePlayerStats = () => {
  const [stats, setStats] = useState<Tables<'user_stats'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Utilisateur non connecté');
        }

        // Using the optimized index on user_id
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (statsError) {
          throw statsError;
        }

        // Create default stats if none exist
        if (!statsData) {
          const { data: newStats, error: createError } = await supabase
            .from('user_stats')
            .insert({
              user_id: user.id,
              games_played: 0,
              games_won: 0,
              level: 1,
              total_xp: 0,
              coins: 0,
              best_streak: 0,
              bluffs_successful: 0,
              bluffs_detected: 0
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          setStats(newStats);
        } else {
          setStats(statsData);
        }
      } catch (err: any) {
        console.error('Error fetching player stats:', err);
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up realtime subscription for stats updates
    const statsChannel = supabase
      .channel('player-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
    };
  }, []);

  const updateStats = async (updates: Partial<Tables<'user_stats'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error updating stats:', err);
    }
  };

  return { stats, loading, error, updateStats };
};
