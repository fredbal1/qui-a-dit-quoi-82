
import React from 'react';

interface AnimatedBackgroundProps {
  variant: 'home' | 'auth' | 'dashboard' | 'create' | 'join' | 'lobby' | 'game';
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant, children }) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'home':
        return 'bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500';
      case 'auth':
        return 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600';
      case 'dashboard':
        return 'bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400';
      case 'create':
        return 'bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400';
      case 'join':
        return 'bg-gradient-to-br from-slate-500 via-blue-500 to-indigo-500';
      case 'lobby':
        return 'bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-400';
      case 'game':
        return 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600';
      default:
        return 'bg-gradient-to-br from-purple-500 to-blue-500';
    }
  };

  const getBlobColors = () => {
    switch (variant) {
      case 'home':
        return ['bg-pink-300', 'bg-purple-300', 'bg-blue-300'];
      case 'auth':
        return ['bg-blue-300', 'bg-indigo-300', 'bg-purple-300'];
      case 'dashboard':
        return ['bg-orange-300', 'bg-amber-300', 'bg-yellow-300'];
      case 'create':
        return ['bg-green-300', 'bg-emerald-300', 'bg-teal-300'];
      case 'join':
        return ['bg-slate-300', 'bg-blue-300', 'bg-indigo-300'];
      case 'lobby':
        return ['bg-cyan-300', 'bg-teal-300', 'bg-blue-300'];
      case 'game':
        return ['bg-purple-300', 'bg-violet-300', 'bg-indigo-300'];
      default:
        return ['bg-purple-300', 'bg-blue-300', 'bg-pink-300'];
    }
  };

  const blobColors = getBlobColors();

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${getBackgroundStyle()} animate-gradient-shift`}>
      {/* Animated liquid blobs */}
      <div className={`liquid-blob w-96 h-96 ${blobColors[0]} top-10 -left-20`} 
           style={{ animationDelay: '0s' }} />
      <div className={`liquid-blob w-80 h-80 ${blobColors[1]} top-40 right-10`} 
           style={{ animationDelay: '2s' }} />
      <div className={`liquid-blob w-72 h-72 ${blobColors[2]} bottom-20 left-20`} 
           style={{ animationDelay: '4s' }} />
      <div className={`liquid-blob w-64 h-64 ${blobColors[0]} bottom-40 -right-10`} 
           style={{ animationDelay: '6s' }} />
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
