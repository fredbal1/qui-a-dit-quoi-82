
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Home, RotateCcw, Share } from 'lucide-react';

interface GameResultsProps {
  scores: {
    player1: number;
    player2: number;
    player3: number;
  };
  onRestart: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ scores, onRestart }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(0);

  const confettiEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎆', '🎁', '🏆'];
  const celebrationEmojis = ['🥳', '🎉', '🎊', '👏', '🎈', '🎆'];

  // Mock player data with names
  const players = [
    { name: 'Alex', score: scores.player1, avatar: '🎮' },
    { name: 'Marie', score: scores.player2, avatar: '🌟' },
    { name: 'Julien', score: scores.player3, avatar: '🎯' }
  ].sort((a, b) => b.score - a.score);

  const winner = players[0];
  const totalCoins = winner.score * 10;

  useEffect(() => {
    // Start confetti animation
    setShowConfetti(true);
    
    // Rotate celebration emojis
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % celebrationEmojis.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const shareResults = () => {
    const message = `🏆 Partie KIADISA terminée !\n\n🥇 ${players[0].name}: ${players[0].score} pts\n🥈 ${players[1].name}: ${players[1].score} pts\n🥉 ${players[2].name}: ${players[2].score} pts\n\nQui sera le prochain champion ? 🎮`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Résultats KIADISA',
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
    }
  };

  return (
    <AnimatedBackground variant="game">
      {/* Floating confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]}
            </div>
          ))}
        </div>
      )}

      <div className="min-h-screen p-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="text-8xl mb-4 animate-pulse-glow">
            {celebrationEmojis[currentEmoji]}
          </div>
          <h1 className="text-5xl font-poppins font-bold text-white mb-2">
            Partie terminée !
          </h1>
          <p className="text-white/80 font-inter text-xl">
            Bravo à tous les participants ! 🎊
          </p>
        </div>

        {/* Winner Spotlight */}
        <GlassCard className="mb-8 text-center animate-slide-up">
          <div className="mb-6">
            <Trophy className="w-20 h-20 text-yellow-300 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-poppins font-bold text-white mb-2">
              🏆 Champion KIADISA
            </h2>
          </div>
          
          <div className="glass-card bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-300/30 p-6 rounded-2xl mb-4">
            <div className="text-6xl mb-3 animate-float">{winner.avatar}</div>
            <h3 className="text-4xl font-poppins font-bold text-white mb-2">
              {winner.name}
            </h3>
            <div className="text-2xl font-bold text-yellow-300">
              {winner.score} points
            </div>
            <div className="text-lg text-yellow-200 mt-2">
              💰 {totalCoins} pièces gagnées !
            </div>
          </div>
          
          <p className="text-white/80 font-inter">
            Félicitations ! Tu es le maître du bluff ! 🎭
          </p>
        </GlassCard>

        {/* Final Rankings */}
        <div className="mb-8">
          <h2 className="text-2xl font-poppins font-bold text-white mb-4 text-center">
            Classement final 📊
          </h2>
          
          <div className="space-y-3">
            {players.map((player, index) => {
              const medals = [
                { icon: <Trophy className="w-6 h-6 text-yellow-300" />, bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-300/30' },
                { icon: <Medal className="w-6 h-6 text-gray-300" />, bg: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-300/30' },
                { icon: <Award className="w-6 h-6 text-orange-400" />, bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-300/30' }
              ];
              
              const medal = medals[index] || medals[2];
              
              return (
                <GlassCard
                  key={player.name}
                  className={`animate-slide-up bg-gradient-to-r ${medal.bg} ${medal.border}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {medal.icon}
                        <span className="text-2xl font-bold text-white">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-3xl animate-float" 
                           style={{ animationDelay: `${index * 0.3}s` }}>
                        {player.avatar}
                      </div>
                      <span className="font-poppins font-semibold text-white text-lg">
                        {player.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {player.score} pts
                      </div>
                      <div className="text-sm text-white/80">
                        {player.score * 10} 💰
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={shareResults}
            className="w-full glass-button text-white border-white/30 hover:bg-white/20 text-lg py-3"
          >
            <Share className="mr-3 w-5 h-5" />
            Partager les résultats 📱
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/create')}
              className="glass-button text-white border-white/30 hover:bg-white/20"
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Rejouer
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="glass-button text-white border-white/30 hover:bg-white/20"
            >
              <Home className="mr-2 w-4 h-4" />
              Accueil
            </Button>
          </div>
        </div>

        {/* Fun Stats */}
        <GlassCard className="mt-8 animate-slide-up bg-blue-500/20 border-blue-300/30">
          <h3 className="font-poppins font-semibold text-blue-100 mb-3 text-center">
            🎯 Statistiques de la partie
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl text-blue-100">🎮</div>
              <div className="text-blue-100/80 text-sm">5 manches</div>
            </div>
            <div>
              <div className="text-2xl text-blue-100">😂</div>
              <div className="text-blue-100/80 text-sm">Fous rires garantis</div>
            </div>
            <div>
              <div className="text-2xl text-blue-100">🕵️</div>
              <div className="text-blue-100/80 text-sm">Secrets révélés</div>
            </div>
            <div>
              <div className="text-2xl text-blue-100">🎭</div>
              <div className="text-blue-100/80 text-sm">Bluffs démasqués</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </AnimatedBackground>
  );
};

export default GameResults;
