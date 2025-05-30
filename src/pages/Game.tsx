
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import KiKaDiGame from '@/components/games/KiKaDiGame';
import KiDiVraiGame from '@/components/games/KiDiVraiGame';
import KiDejaGame from '@/components/games/KiDejaGame';
import KiDeNousGame from '@/components/games/KiDeNousGame';
import GameResults from '@/components/games/GameResults';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Game = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [currentGame, setCurrentGame] = useState<string>('kikadi');
  const [gamePhase, setGamePhase] = useState<'playing' | 'results'>('playing');
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    player3: 0
  });

  const games = ['kikadi', 'kidivrai', 'kideja', 'kidenous'];

  useEffect(() => {
    // Rotate games for each round
    const gameIndex = (currentRound - 1) % games.length;
    setCurrentGame(games[gameIndex]);
  }, [currentRound]);

  const handleGameComplete = (roundScores: any) => {
    // Update total scores
    setScores(prev => ({
      player1: prev.player1 + (roundScores.player1 || 0),
      player2: prev.player2 + (roundScores.player2 || 0),
      player3: prev.player3 + (roundScores.player3 || 0)
    }));

    // Check if game is over
    if (currentRound >= totalRounds) {
      setGamePhase('results');
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const renderCurrentGame = () => {
    const commonProps = {
      onComplete: handleGameComplete,
      currentRound,
      totalRounds
    };

    switch (currentGame) {
      case 'kikadi':
        return <KiKaDiGame {...commonProps} />;
      case 'kidivrai':
        return <KiDiVraiGame {...commonProps} />;
      case 'kideja':
        return <KiDejaGame {...commonProps} />;
      case 'kidenous':
        return <KiDeNousGame {...commonProps} />;
      default:
        return <KiKaDiGame {...commonProps} />;
    }
  };

  if (gamePhase === 'results') {
    return <GameResults scores={scores} onRestart={() => navigate('/dashboard')} />;
  }

  return (
    <AnimatedBackground variant="game">
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 relative z-20">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <div className="text-white font-poppins font-semibold">
              Manche {currentRound}/{totalRounds}
            </div>
            <div className="text-white/80 text-sm">
              Partie {gameId}
            </div>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Game Content */}
        <div className="relative z-10">
          {renderCurrentGame()}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Game;
