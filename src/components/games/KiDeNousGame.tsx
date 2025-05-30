
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Crown } from 'lucide-react';

interface KiDeNousGameProps {
  onComplete: (scores: any) => void;
  currentRound: number;
  totalRounds: number;
}

const KiDeNousGame: React.FC<KiDeNousGameProps> = ({ onComplete, currentRound, totalRounds }) => {
  const [phase, setPhase] = useState<'intro' | 'vote' | 'reveal' | 'result'>('intro');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [timer, setTimer] = useState(5);
  const [typingText, setTypingText] = useState('');

  const question = "Qui de vous est le plus peureux ? 🐔";
  const players = ['Alex', 'Marie', 'Julien'];
  const questionEmoji = '🐔';

  const fullText = "Qui de vous est le plus peureux ?";

  useEffect(() => {
    if (phase === 'intro' && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (phase === 'intro' && timer === 0) {
      // Start typing effect
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypingText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setPhase('vote'), 1000);
        }
      }, 100);
      return () => clearInterval(typingInterval);
    }
  }, [phase, timer]);

  const handleVote = () => {
    if (selectedPlayer) {
      setPhase('reveal');
      setTimeout(() => setPhase('result'), 3000);
    }
  };

  const handleResult = () => {
    const scores = {
      player1: Math.floor(Math.random() * 3) + 1,
      player2: Math.floor(Math.random() * 3) + 1,
      player3: Math.floor(Math.random() * 3) + 1
    };
    onComplete(scores);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="text-center animate-bounce-in">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-pulse-glow">😱</div>
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">
              KiDeNous 😱
            </h1>
            <p className="text-white/80 font-inter text-lg">
              Qui correspond le mieux ?
            </p>
          </div>
          
          <GlassCard className="mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{timer}</div>
              <p className="text-white/80">Question en approche...</p>
            </div>
          </GlassCard>

          {timer === 0 && (
            <GlassCard className="animate-slide-up">
              <div className="text-center">
                <div className="text-4xl mb-4">{questionEmoji}</div>
                <div className="text-2xl font-poppins font-bold text-white min-h-[2em] flex items-center justify-center">
                  <span className="border-r-2 border-white animate-pulse">
                    {typingText}
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Vote Phase */}
      {phase === 'vote' && (
        <div className="animate-slide-up">
          <GlassCard className="mb-6">
            <div className="text-center">
              <div className="text-4xl mb-4">{questionEmoji}</div>
              <h2 className="text-2xl font-poppins font-bold text-white mb-4">
                {question}
              </h2>
              <p className="text-white/80 font-inter">
                Sélectionnez un autre joueur (pas vous !)
              </p>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h3 className="text-xl font-poppins font-semibold text-white text-center mb-4">
              Votre vote :
            </h3>
            
            {players.map((player, index) => (
              <GlassCard
                key={player}
                hover
                onClick={() => setSelectedPlayer(player)}
                className={`cursor-pointer transition-all duration-300 animate-bounce-in ${
                  selectedPlayer === player 
                    ? 'ring-2 ring-white bg-white/30' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">👤</div>
                    <span className="font-poppins font-semibold text-white text-lg">
                      {player}
                    </span>
                  </div>
                  {selectedPlayer === player && (
                    <div className="text-2xl animate-bounce">✓</div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          <Button
            onClick={handleVote}
            disabled={!selectedPlayer}
            className="w-full mt-6 glass-button text-white border-white/30 hover:bg-white/20"
          >
            Confirmer mon vote <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Reveal Phase */}
      {phase === 'reveal' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <h2 className="text-3xl font-poppins font-bold text-white mb-6">
              Et le plus peureux est... 😱
            </h2>
            
            <div className="mb-6">
              <div className="text-8xl mb-4">🎯</div>
              
              {/* Mock arrows pointing to the most voted player */}
              <div className="relative">
                <div className="glass-card bg-yellow-500/20 border-yellow-300/30 p-6 rounded-xl">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
                    <div className="text-4xl">👤</div>
                    <span className="font-poppins font-bold text-white text-2xl">
                      Marie
                    </span>
                    <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
                  </div>
                  <div className="text-yellow-100 font-bold text-xl mb-2">
                    LA PLUS PEUREUSE ! 🐔
                  </div>
                  <p className="text-yellow-100/80">
                    3 votes sur 3 !
                  </p>
                </div>
                
                {/* Animated arrows */}
                <div className="absolute -top-16 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
                  ↘️
                </div>
                <div className="absolute -top-16 right-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                  ↙️
                </div>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>
                  ⬆️
                </div>
              </div>
            </div>

            <div className="space-y-2 text-white/80 text-sm">
              <p>Alex a voté pour : Marie</p>
              <p>Marie a voté pour : Marie</p>
              <p>Julien a voté pour : Marie</p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <h2 className="text-3xl font-poppins font-bold text-white mb-4">
              Distribution des points ! 🏆
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center glass-card bg-yellow-500/20 p-3 rounded-xl">
                <span className="text-white font-poppins">👑 Marie (Élue)</span>
                <span className="text-yellow-300 font-bold">+1 pt</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-blue-500/20 p-3 rounded-xl">
                <span className="text-white font-poppins">🎯 Alex (Bon vote)</span>
                <span className="text-blue-300 font-bold">+1 pt</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-blue-500/20 p-3 rounded-xl">
                <span className="text-white font-poppins">🎯 Julien (Bon vote)</span>
                <span className="text-blue-300 font-bold">+1 pt</span>
              </div>
            </div>

            <div className="glass-card bg-white/10 p-4 rounded-xl mb-6">
              <p className="text-white/80 text-sm font-inter">
                💡 Règle : +1 pt pour la personne élue + +1 pt pour ceux qui ont voté pour elle
              </p>
            </div>

            <Button
              onClick={handleResult}
              className="w-full glass-button text-white border-white/30 hover:bg-white/20 text-lg py-3"
            >
              {currentRound < totalRounds ? 'Manche suivante' : 'Voir les résultats finaux'} 🚀
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default KiDeNousGame;
