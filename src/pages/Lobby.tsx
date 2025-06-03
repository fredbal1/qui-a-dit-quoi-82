
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStateFromSupabase } from '@/hooks/useGameStateFromSupabase';
import { useCurrentPlayer } from '@/hooks/useCurrentPlayer';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Users, Copy, Play, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Lobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { gameState, loading: gameLoading, error: gameError } = useGameStateFromSupabase(gameId || '');
  const { currentPlayer, loading: playerLoading } = useCurrentPlayer(gameId || '');

  const floatingEmojis = ['🎉', '🎮', '🎲', '🎪', '⭐', '🚀', '💫', '🎭'];
  const [currentEmoji, setCurrentEmoji] = useState(0);

  const waitingMessages = [
    "🎭 En attente des autres joueurs...",
    "🎪 Préparez-vous à découvrir vos secrets !",
    "🎲 La partie va bientôt commencer...",
    "🎮 Qui sera le maître du bluff ?"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  // Redirection si pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, authLoading, navigate]);

  // Rotate floating emojis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % floatingEmojis.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Rotate waiting messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % waitingMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameId || '');
    toast({
      title: "Code copié ! 📋",
      description: "Partage-le avec tes amis pour qu'ils rejoignent",
    });
  };

  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KIADISA - Rejoins ma partie !',
        text: `Salut ! Rejoins ma partie KIADISA avec le code : ${gameId}`,
        url: window.location.href,
      });
    } else {
      copyGameCode();
    }
  };

  const startGame = () => {
    if (currentPlayer?.is_host) {
      navigate(`/game/${gameId}`);
    }
  };

  // Loading states
  if (authLoading || gameLoading || playerLoading) {
    return (
      <AnimatedBackground variant="lobby">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </AnimatedBackground>
    );
  }

  // Error state
  if (gameError || !gameState) {
    return (
      <AnimatedBackground variant="lobby">
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center">
            <div className="text-red-400 mb-4">Erreur : Partie introuvable</div>
            <Button onClick={() => navigate('/dashboard')}>
              Retour au Dashboard
            </Button>
          </GlassCard>
        </div>
      </AnimatedBackground>
    );
  }

  const isHost = currentPlayer?.is_host || false;
  const players = gameState.game_players || [];

  return (
    <AnimatedBackground variant="lobby">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-poppins font-bold text-white">
              Salon d'attente
            </h1>
          </div>
          <Badge className="glass-card text-white border-white/30 font-mono tracking-wider">
            {gameState.code}
          </Badge>
        </div>

        {/* Game Code */}
        <GlassCard className="mb-6 text-center animate-bounce-in">
          <h2 className="text-lg font-poppins font-semibold text-white mb-3">
            Code de la partie
          </h2>
          <div className="text-3xl font-mono font-bold text-white mb-4 tracking-widest">
            {gameState.code}
          </div>
          <div className="flex space-x-3 justify-center">
            <Button
              onClick={copyGameCode}
              className="bg-white/20 border-white/50 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button
              onClick={shareGame}
              className="bg-white/20 border-white/50 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200"
            >
              <Share className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </GlassCard>

        {/* Players List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Joueurs ({players.length}/8)
            </h2>
            <div className="text-4xl animate-bounce">
              {floatingEmojis[currentEmoji]}
            </div>
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <GlassCard 
                key={player.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl animate-float"
                         style={{ animationDelay: `${index * 0.5}s` }}>
                      🎮
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-white flex items-center">
                        Joueur {index + 1}
                        {player.is_host && (
                          <Crown className="ml-2 w-4 h-4 text-yellow-300" />
                        )}
                      </h3>
                      <p className="text-white/80 text-sm font-inter">
                        {player.is_host ? 'Créateur de la partie' : 'Joueur'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-inter">En ligne</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Waiting Message */}
        <GlassCard className="mb-6 text-center animate-pulse-glow">
          <div className="text-white font-inter">
            {waitingMessages[currentMessage]}
          </div>
        </GlassCard>

        {/* Start Game Button (Host Only) */}
        {isHost && gameState.status === 'waiting' && (
          <Button
            onClick={startGame}
            className="w-full glass-button text-white border-white/30 hover:bg-white/20 text-lg py-6 font-poppins font-semibold animate-pulse-glow"
          >
            <Play className="mr-3 w-6 h-6" />
            Commencer la partie ! 🚀
          </Button>
        )}

        {/* Non-host message */}
        {!isHost && (
          <GlassCard className="text-center bg-blue-500/20 border-blue-300/30">
            <p className="text-blue-100 font-inter">
              👑 Seul le créateur de la partie peut la lancer
            </p>
          </GlassCard>
        )}

        {/* Game started message */}
        {gameState.status === 'active' && (
          <GlassCard className="text-center bg-green-500/20 border-green-300/30">
            <p className="text-green-100 font-inter mb-4">
              🎮 La partie a commencé !
            </p>
            <Button
              onClick={() => navigate(`/game/${gameId}`)}
              className="bg-green-500/30 border-green-300/50 text-white hover:bg-green-500/50"
            >
              Rejoindre la partie
            </Button>
          </GlassCard>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Lobby;
