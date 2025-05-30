
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Check, X } from 'lucide-react';

interface KiDejaGameProps {
  onComplete: (scores: any) => void;
  currentRound: number;
  totalRounds: number;
}

const KiDejaGame: React.FC<KiDejaGameProps> = ({ onComplete, currentRound, totalRounds }) => {
  const [phase, setPhase] = useState<'intro' | 'answer' | 'vote' | 'reveal' | 'result'>('intro');
  const [hasExperienced, setHasExperienced] = useState(false);
  const [votes, setVotes] = useState<{[key: string]: boolean}>({});
  const [timer, setTimer] = useState(5);

  const question = "Qui a déjà mangé quelque chose qui était tombé par terre ? 🧻";
  const players = ['Alex', 'Marie', 'Julien'];

  const orbitingEmojis = ['👃', '🍻', '🧻', '🤭', '😅'];
  const [currentEmoji, setCurrentEmoji] = useState(0);

  useEffect(() => {
    if (phase === 'intro' && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (phase === 'intro' && timer === 0) {
      setPhase('answer');
    }

    // Rotate emojis
    const emojiInterval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % orbitingEmojis.length);
    }, 1000);

    return () => clearInterval(emojiInterval);
  }, [phase, timer]);

  const handleSubmitAnswer = () => {
    setPhase('vote');
  };

  const handleVote = (player: string, hasExperienced: boolean) => {
    setVotes(prev => ({ ...prev, [player]: hasExperienced }));
  };

  const handleConfirmVotes = () => {
    setPhase('reveal');
    setTimeout(() => setPhase('result'), 3000);
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
            <div className="relative mb-6">
              {/* Central question emoji */}
              <div className="text-6xl mb-4 animate-pulse-glow">🤭</div>
              
              {/* Orbiting emojis */}
              <div className="relative">
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                  <div className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>
                    {orbitingEmojis[currentEmoji]}
                  </div>
                </div>
                <div className="absolute -top-10 right-0">
                  <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                    {orbitingEmojis[(currentEmoji + 1) % orbitingEmojis.length]}
                  </div>
                </div>
                <div className="absolute -top-10 left-0">
                  <div className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>
                    {orbitingEmojis[(currentEmoji + 2) % orbitingEmojis.length]}
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">
              KiDéjà 🤭
            </h1>
            <p className="text-white/80 font-inter text-lg">
              Qui a déjà fait ça ?
            </p>
          </div>
          
          <GlassCard className="mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{timer}</div>
              <p className="text-white/80">Préparez-vous à révéler vos secrets...</p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Answer Phase */}
      {phase === 'answer' && (
        <div className="animate-slide-up">
          <GlassCard className="mb-6">
            <h2 className="text-2xl font-poppins font-bold text-white mb-4 text-center">
              Question du jour 🤔
            </h2>
            <div className="glass-card bg-white/10 p-6 rounded-xl mb-6 text-center">
              <p className="text-white text-xl font-inter">
                {question}
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-white font-poppins font-semibold text-lg">
                  Et vous, l'avez-vous déjà fait ?
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setHasExperienced(true)}
                  className={`h-20 ${
                    hasExperienced 
                      ? 'bg-green-500/30 border-green-300' 
                      : 'glass-button border-white/30'
                  } text-white hover:bg-green-500/20`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">✅</div>
                    <div className="font-poppins font-semibold">Déjà fait</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setHasExperienced(false)}
                  className={`h-20 ${
                    !hasExperienced && hasExperienced !== null
                      ? 'bg-red-500/30 border-red-300' 
                      : 'glass-button border-white/30'
                  } text-white hover:bg-red-500/20`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">❌</div>
                    <div className="font-poppins font-semibold">Jamais</div>
                  </div>
                </Button>
              </div>

              <Button
                onClick={handleSubmitAnswer}
                className="w-full glass-button text-white border-white/30 hover:bg-white/20"
              >
                Valider ma réponse
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
              Devinez qui a déjà fait ça ! 🕵️
            </h2>
            <p className="text-white/80 text-center font-inter">
              Pour chaque joueur, dites s'il a déjà fait ça ou pas
            </p>
          </GlassCard>

          <div className="space-y-4">
            {players.map((player, index) => (
              <GlassCard key={player} className="animate-bounce-in" 
                        style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">👤</div>
                    <span className="font-poppins font-semibold text-white text-lg">
                      {player}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleVote(player, true)}
                      className={`${
                        votes[player] === true
                          ? 'bg-green-500/30 border-green-300' 
                          : 'glass-button border-white/30'
                      } text-white hover:bg-green-500/20`}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Déjà fait
                    </Button>
                    <Button
                      onClick={() => handleVote(player, false)}
                      className={`${
                        votes[player] === false
                          ? 'bg-red-500/30 border-red-300' 
                          : 'glass-button border-white/30'
                      } text-white hover:bg-red-500/20`}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Jamais
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <Button
            onClick={handleConfirmVotes}
            disabled={Object.keys(votes).length < players.length}
            className="w-full mt-6 glass-button text-white border-white/30 hover:bg-white/20"
          >
            Confirmer mes votes <Users className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Reveal Phase */}
      {phase === 'reveal' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <h2 className="text-3xl font-poppins font-bold text-white mb-6">
              Et la vérité est... 😱
            </h2>
            
            <div className="space-y-4">
              <div className="glass-card bg-green-500/20 border-green-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-3xl">👤</span>
                  <span className="font-poppins font-bold text-white">Alex</span>
                  <div className="text-4xl animate-bounce">😅</div>
                </div>
                <div className="text-green-100 font-bold text-lg">L'A DÉJÀ FAIT !</div>
                <p className="text-green-100/80 text-sm italic">
                  "Oui... la règle des 5 secondes !"
                </p>
              </div>

              <div className="glass-card bg-red-500/20 border-red-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-3xl">👤</span>
                  <span className="font-poppins font-bold text-white">Marie</span>
                  <div className="text-4xl animate-bounce">🙈</div>
                </div>
                <div className="text-red-100 font-bold text-lg">JAMAIS !</div>
                <p className="text-red-100/80 text-sm italic">
                  "Beurk, jamais de la vie !"
                </p>
              </div>

              <div className="glass-card bg-green-500/20 border-green-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-3xl">👤</span>
                  <span className="font-poppins font-bold text-white">Julien</span>
                  <div className="text-4xl animate-bounce">😋</div>
                </div>
                <div className="text-green-100 font-bold text-lg">BIEN SÛR !</div>
                <p className="text-green-100/80 text-sm italic">
                  "La nourriture c'est sacré !"
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <div className="text-center animate-bounce-in">
          <GlassCard>
            <h2 className="text-3xl font-poppins font-bold text-white mb-4">
              Scores des détectives ! 🕵️
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Bonne déduction Alex</span>
                <span className="text-green-300 font-bold">+1 pt</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Bonne déduction Marie</span>
                <span className="text-green-300 font-bold">+1 pt</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Julien (s'est trompé)</span>
                <span className="text-gray-400 font-bold">0 pt</span>
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

export default KiDejaGame;
