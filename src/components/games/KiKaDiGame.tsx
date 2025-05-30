
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Users, ArrowRight, Trophy } from 'lucide-react';

interface KiKaDiGameProps {
  onComplete: (scores: any) => void;
  currentRound: number;
  totalRounds: number;
}

const KiKaDiGame: React.FC<KiKaDiGameProps> = ({ onComplete, currentRound, totalRounds }) => {
  const [phase, setPhase] = useState<'intro' | 'answer' | 'vote' | 'reveal' | 'result'>('intro');
  const [answer, setAnswer] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [timer, setTimer] = useState(5);

  const question = "Quelle est votre citation inspirante préférée ?";
  const players = ['Alex', 'Marie', 'Julien'];
  const answers = [
    { id: '1', text: "La vie est belle quand on sait la regarder", author: 'Alex' },
    { id: '2', text: "Chaque jour est une nouvelle aventure", author: 'Marie' },
    { id: '3', text: "Il faut toujours croire en ses rêves", author: 'Julien' }
  ];

  useEffect(() => {
    if (phase === 'intro' && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (phase === 'intro' && timer === 0) {
      setPhase('answer');
    }
  }, [phase, timer]);

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      setPhase('vote');
    }
  };

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
            <Brain className="w-20 h-20 text-white mx-auto mb-4 animate-float" />
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">
              KiKaDi 🧠
            </h1>
            <p className="text-white/80 font-inter text-lg">
              Devinez qui a écrit quoi !
            </p>
          </div>
          
          <GlassCard className="mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{timer}</div>
              <p className="text-white/80">La partie commence dans...</p>
            </div>
          </GlassCard>

          <div className="space-y-2">
            <div className="text-white/60">📝 Écrivez votre réponse</div>
            <div className="text-white/60">🤔 Devinez qui a écrit quoi</div>
            <div className="text-white/60">🎯 Marquez des points si vous trouvez</div>
          </div>
        </div>
      )}

      {/* Answer Phase */}
      {phase === 'answer' && (
        <div className="animate-slide-up">
          <GlassCard className="mb-6">
            <h2 className="text-2xl font-poppins font-bold text-white mb-4 text-center">
              Question 📝
            </h2>
            <div className="glass-card bg-white/10 p-4 rounded-xl mb-6">
              <p className="text-white text-lg font-inter text-center">
                {question}
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-4">
              <Label className="text-white font-poppins font-semibold">
                Votre réponse
              </Label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Écrivez votre citation inspirante..."
                className="glass-card border-white/30 text-white placeholder:text-white/60"
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full glass-button text-white border-white/30 hover:bg-white/20"
              >
                Valider ma réponse <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Vote Phase */}
      {phase === 'vote' && (
        <div className="animate-slide-up">
          <GlassCard className="mb-6">
            <h2 className="text-2xl font-poppins font-bold text-white mb-4 text-center">
              Qui a écrit quoi ? 🤔
            </h2>
            <p className="text-white/80 text-center font-inter">
              Associez chaque réponse à son auteur
            </p>
          </GlassCard>

          <div className="space-y-4">
            {answers.map((answer, index) => (
              <GlassCard key={answer.id} className="animate-bounce-in" 
                        style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-4">
                  <p className="text-white font-inter italic">
                    "{answer.text}"
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {players.map((player) => (
                    <Button
                      key={player}
                      onClick={() => setSelectedPlayer(player)}
                      className={`text-sm ${
                        selectedPlayer === player 
                          ? 'bg-white/30 border-white' 
                          : 'glass-button border-white/30'
                      } text-white`}
                    >
                      {player}
                    </Button>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <Button
            onClick={handleVote}
            disabled={!selectedPlayer}
            className="w-full mt-6 glass-button text-white border-white/30 hover:bg-white/20"
          >
            Confirmer mes choix <Users className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Reveal Phase */}
      {phase === 'reveal' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <h2 className="text-3xl font-poppins font-bold text-white mb-6">
              Révélation ! 😲
            </h2>
            
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={answer.id} 
                     className="glass-card bg-white/10 p-4 rounded-xl animate-slide-up"
                     style={{ animationDelay: `${index * 0.5}s` }}>
                  <p className="text-white font-inter italic mb-2">
                    "{answer.text}"
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-white/80">écrit par</span>
                    <div className="text-2xl">👤</div>
                    <span className="font-poppins font-bold text-white">
                      {answer.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-poppins font-bold text-white mb-4">
              Résultats de la manche ! 🏆
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">🥇 Alex</span>
                <span className="text-yellow-300 font-bold">+3 pts</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">🥈 Marie</span>
                <span className="text-gray-300 font-bold">+2 pts</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">🥉 Julien</span>
                <span className="text-orange-300 font-bold">+1 pt</span>
              </div>
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

export default KiKaDiGame;
