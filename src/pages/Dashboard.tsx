
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { 
  Plus, 
  Users, 
  Trophy, 
  Settings, 
  LogOut,
  Star,
  Coins,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading, error: statsError } = usePlayerStats();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  const getXPForNextLevel = (level: number) => {
    return level * 100; // 100 XP par niveau
  };

  const getXPProgress = () => {
    if (!stats) return 0;
    const currentLevelXP = (stats.level - 1) * 100;
    const nextLevelXP = stats.level * 100;
    const progressXP = stats.total_xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    return (progressXP / neededXP) * 100;
  };

  if (authLoading || statsLoading) {
    return (
      <AnimatedBackground variant="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </AnimatedBackground>
    );
  }

  if (statsError) {
    return (
      <AnimatedBackground variant="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center">
            <div className="text-red-400 mb-4">Erreur de chargement</div>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </GlassCard>
        </div>
      </AnimatedBackground>
    );
  }

  const defaultStats = {
    level: 1,
    total_xp: 0,
    coins: 0,
    games_played: 0,
    games_won: 0,
    best_streak: 0,
    bluffs_successful: 0,
    bluffs_detected: 0
  };

  const playerStats = stats || defaultStats;

  return (
    <AnimatedBackground variant="dashboard">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white">
                Salut, {user?.email?.split('@')[0] || 'Joueur'} !
              </h1>
              <p className="text-white/70 font-inter">
                Prêt pour une nouvelle partie ?
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Statistiques du joueur */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Niveau et XP */}
          <GlassCard className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-white">
                    Niveau {playerStats.level}
                  </h3>
                  <p className="text-sm text-white/70 font-inter">
                    {playerStats.total_xp} XP total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-poppins font-bold">
                  {getXPForNextLevel(playerStats.level) - playerStats.total_xp} XP
                </div>
                <div className="text-sm text-white/70">
                  pour niveau {playerStats.level + 1}
                </div>
              </div>
            </div>
            <Progress value={getXPProgress()} className="h-2" />
          </GlassCard>

          {/* Coins */}
          <GlassCard>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-white">
                  {playerStats.coins}
                </h3>
                <p className="text-sm text-white/70 font-inter">Coins</p>
              </div>
            </div>
          </GlassCard>

          {/* Parties jouées */}
          <GlassCard>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-white">
                  {playerStats.games_played}
                </h3>
                <p className="text-sm text-white/70 font-inter">Parties</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Statistiques avancées */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassCard>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-white mb-1">
                {playerStats.games_played > 0 
                  ? Math.round((playerStats.games_won / playerStats.games_played) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-white/70 font-inter">Victoires</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-white mb-1">
                {playerStats.best_streak}
              </div>
              <p className="text-sm text-white/70 font-inter">Meilleure série</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-white mb-1">
                {playerStats.bluffs_successful}
              </div>
              <p className="text-sm text-white/70 font-inter">Bluffs réussis</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-white mb-1">
                {playerStats.bluffs_detected}
              </div>
              <p className="text-sm text-white/70 font-inter">Bluffs détectés</p>
            </div>
          </GlassCard>
        </div>

        {/* Actions principales */}
        <div className="space-y-4">
          <Link to="/create-game">
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-white">
                    Créer une partie
                  </h3>
                  <p className="text-sm text-white/70 font-inter">
                    Lance une nouvelle partie et invite tes amis
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link to="/join-game">
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-white">
                    Rejoindre une partie
                  </h3>
                  <p className="text-sm text-white/70 font-inter">
                    Entre le code d'une partie existante
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <GlassCard hover className="cursor-pointer opacity-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-poppins font-semibold text-white">
                  Classements
                </h3>
                <p className="text-sm text-white/70 font-inter">
                  Bientôt disponible...
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;
