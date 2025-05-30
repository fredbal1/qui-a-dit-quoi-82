
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = false, 
  onClick,
  style 
}) => {
  return (
    <div
      className={cn(
        'glass-card p-6',
        hover && 'glass-button cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
