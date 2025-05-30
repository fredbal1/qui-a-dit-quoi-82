
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, Brain, MessageSquare, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "2–8 joueurs",
      description: "Plus on est de fous, plus on rit !"
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "Mini-jeux variés",
      description: "KiKaDi, KiDiVrai, KiDéjà, KiDeNous"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      title: "Révélations",
      description: "Découvrez qui se cache derrière quoi"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Fun garanti",
      description: "Fous rires et moments mémorables"
    }
  ];

  return (
    <AnimatedBackground variant="home">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        {/* Header */}
        <div className="mb-12 animate-bounce-in">
          <h1 className="text-6xl md:text-8xl font-poppins font-bold text-white mb-4 drop-shadow-2xl">
            KIADISA
          </h1>
          <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-white/90 mb-2">
            Qui a dit ça ? 😲
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-inter">
            Le jeu social qui crée du lien !
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-4xl w-full animate-slide-up">
          {features.map((feature, index) => (
            <GlassCard 
              key={index}
              className="text-center animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-3 flex justify-center animate-float">
                {feature.icon}
              </div>
              <h3 className="font-poppins font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/80 font-inter">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* CTA Button */}
        <div className="animate-pulse-glow">
          <Button
            onClick={() => navigate('/auth')}
            className="glass-button text-white border-white/30 text-xl px-8 py-4 h-auto font-poppins font-semibold group"
          >
            <Gamepad2 className="mr-3 w-6 h-6 group-hover:animate-bounce" />
            Envie de jouer ? 🎮
          </Button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white/60 text-sm font-inter">
            v1.0.0 • Made with ❤️ for fun
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Index;
