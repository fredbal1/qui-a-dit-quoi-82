
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, 
  UserPlus, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Lightbulb,
  LogOut,
  Crown
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "💡 Bluffer avec subtilité te fera gagner plus de points !",
    "🎯 Observe bien les réactions de tes amis pendant les révélations",
    "🏆 Plus tu joues, plus tu débloques d'avatars et de titres",
    "🤝 Invite tes amis pour des parties encore plus fun !",
    "🎲 Chaque mini-jeu a sa stratégie, maîtrise-les tous !"
  ];

  useEffect(() => {
    const userData = localStorage.getItem('kiadisa_user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    setUser(JSON.parse(userData));

    // Rotate tips every 5 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('kiadisa_user');
    navigate('/');
  };

  if (!user) return null;

  const mockXP = 1250;
  const mockLevel = 8;
  const xpToNextLevel = 1500;
  const xpProgress = (mockXP / xpToNextLevel) * 100;

  const actions = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Créer une partie",
      description: "Lance un nouveau jeu",
      action: () => navigate('/create'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Rejoindre",
      description: "Rejoins tes amis",
      action: () => navigate('/join'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Boutique",
      description: "Avatars & titres",
      action: () => {},
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Stats",
      description: "Tes performances",
      action: () => {},
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Réglages",
      description: "Personnalise ton jeu",
      action: () => {},
      color: "from-slate-500 to-gray-500"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Dev Preview",
      description: "Fonctions en test",
      action: () => {},
      color: "from-yellow-500 to-amber-500"
    }
  ];

  return (
    <AnimatedBackground variant="dashboard">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-bounce">{user.avatar}</div>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white flex items-center">
                {user.pseudo}
                {mockLevel >= 10 && <Crown className="ml-2 w-5 h-5 text-yellow-300" />}
              </h1>
              <p className="text-white/80 font-inter">
                {user.isGuest ? 'Joueur Invité' : 'Maître du Bluff'} • Niveau {mockLevel}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* XP Progress */}
        <GlassCard className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-inter font-medium">Expérience</span>
            <span className="text-white/80 text-sm">{mockXP} / {xpToNextLevel} XP</span>
          </div>
          <Progress value={xpProgress} className="h-3 bg-white/20" />
        </GlassCard>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {actions.map((action, index) => (
            <GlassCard
              key={index}
              hover
              onClick={action.action}
              className="text-center cursor-pointer animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <h3 className="font-poppins font-semibold text-white mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-white/80 font-inter">
                {action.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Rotating Tips */}
        <GlassCard className="animate-pulse-glow">
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-6 h-6 text-yellow-300 flex-shrink-0 animate-pulse" />
            <p className="text-white font-inter text-sm leading-relaxed">
              {tips[currentTip]}
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;
