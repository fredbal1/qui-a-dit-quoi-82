
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';

interface KiDiVraiGameProps {
  onComplete: (scores: any) => void;
  currentRound: number;
  totalRounds: number;
}

const KiDiVraiGame: React.FC<KiDiVraiGameProps> = ({ onComplete, currentRound, totalRounds }) => {
  const [phase, setPhase] = useState<'intro' | 'answer' | 'vote' | 'reveal' | 'result'>('intro');
  const [answer, setAnswer] = useState('');
  const [isBluffing, setIsBluffing] = useState(false);
  const [timer, setTimer] = useState(5);

  const question = "Raconte-nous ton plus gros mensonge d'enfance";

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

  const handleVote = (vote: 'true' | 'false') => {
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
              {/* Central emoji */}
              <div className="text-6xl mb-4 animate-pulse-glow">😏</div>
              
              {/* Angel and devil */}
              <div className="flex justify-between items-center max-w-xs mx-auto">
                <div className="text-left">
                  <div className="text-4xl mb-2">😇</div>
                  <div className="glass-card bg-white/10 p-2 rounded-lg">
                    <p className="text-white text-sm">Dis la vérité...</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl mb-2">😈</div>
                  <div className="glass-card bg-white/10 p-2 rounded-lg">
                    <p className="text-white text-sm">Ments un peu...</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">
              KiDiVrai 😏
            </h1>
            <p className="text-white/80 font-inter text-lg">
              Vérité ou bluff ? À vous de voir !
            </p>
          </div>
          
          <GlassCard className="mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{timer}</div>
              <p className="text-white/80">Préparez-vous à bluffer...</p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Answer Phase */}
      {phase === 'answer' && (
        <div className="animate-slide-up">
          <GlassCard className="mb-6">
            <h2 className="text-2xl font-poppins font-bold text-white mb-4 text-center">
              Question 🤔
            </h2>
            <div className="glass-card bg-white/10 p-4 rounded-xl mb-6">
              <p className="text-white text-lg font-inter text-center">
                {question}
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-6">
              {/* Bluff Toggle */}
              <div className="glass-card bg-red-500/20 border-red-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-red-100 font-poppins font-semibold">
                      Je bluffe 😏
                    </Label>
                    <p className="text-red-100/80 text-sm">
                      Active si tu vas mentir
                    </p>
                  </div>
                  <Switch
                    checked={isBluffing}
                    onCheckedChange={setIsBluffing}
                  />
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <Label className="text-white font-poppins font-semibold">
                  Votre réponse
                </Label>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Racontez votre histoire..."
                  className="glass-card border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <Button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full glass-button text-white border-white/30 hover:bg-white/20"
              >
                {isBluffing ? 'Valider mon bluff 😈' : 'Valider ma vérité 😇'}
                <ArrowRight className="ml-2 w-4 h-4" />
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
              Vrai ou Faux ? 🤔
            </h2>
            <p className="text-white/80 text-center font-inter">
              Lisez les réponses et votez
            </p>
          </GlassCard>

          <div className="space-y-4">
            {/* Mock answers from other players */}
            <GlassCard>
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">👤</div>
                  <span className="font-poppins font-semibold text-white">Alex</span>
                </div>
                <p className="text-white font-inter italic">
                  "J'ai dit à mes parents que j'avais mangé mes légumes alors que je les avais cachés sous mon lit pendant des semaines."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleVote('true')}
                  className="glass-button text-white border-green-300/30 hover:bg-green-500/20"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vrai
                </Button>
                <Button
                  onClick={() => handleVote('false')}
                  className="glass-button text-white border-red-300/30 hover:bg-red-500/20"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Il bluffe !
                </Button>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">👤</div>
                  <span className="font-poppins font-semibold text-white">Marie</span>
                </div>
                <p className="text-white font-inter italic">
                  "J'ai convaincu ma maitresse que mon chien avait mangé mes devoirs, alors que je n'avais même pas de chien."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleVote('true')}
                  className="glass-button text-white border-green-300/30 hover:bg-green-500/20"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vrai
                </Button>
                <Button
                  onClick={() => handleVote('false')}
                  className="glass-button text-white border-red-300/30 hover:bg-red-500/20"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Il bluffe !
                </Button>
              </div>
            </GlassCard>
          </div>
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
              <div className="glass-card bg-green-500/20 border-green-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-poppins font-bold text-white">Alex</span>
                  <div className="text-4xl animate-bounce">😇</div>
                </div>
                <div className="text-green-100 font-bold text-lg">VRAI !</div>
                <p className="text-green-100/80 text-sm">Il disait la vérité</p>
              </div>

              <div className="glass-card bg-red-500/20 border-red-300/30 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-poppins font-bold text-white">Marie</span>
                  <div className="text-4xl animate-bounce">😈</div>
                </div>
                <div className="text-red-100 font-bold text-lg">MYTHO ! 💣</div>
                <p className="text-red-100/80 text-sm">Elle bluffait !</p>
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
              Scores de la manche ! 🏆
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Alex (Vérité)</span>
                <span className="text-green-300 font-bold">+2 pts</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Marie (Bluff réussi)</span>
                <span className="text-yellow-300 font-bold">+2 pts</span>
              </div>
              <div className="flex justify-between items-center glass-card bg-white/10 p-3 rounded-xl">
                <span className="text-white font-poppins">Détectives</span>
                <span className="text-blue-300 font-bold">+1 pt</span>
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

export default KiDiVraiGame;
