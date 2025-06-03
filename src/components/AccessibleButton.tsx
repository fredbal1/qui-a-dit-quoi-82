
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  ariaLabel?: string;
  describedBy?: string;
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'default',
    loading = false,
    ariaLabel,
    describedBy,
    disabled,
    className,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-busy={loading}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          // Améliorer les contrastes
          'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          // Assurer une taille minimum pour les clics tactiles
          'min-h-[44px] min-w-[44px]',
          // Transitions pour feedback visuel
          'transition-all duration-200',
          // États hover et focus améliorés
          'hover:scale-105 focus:scale-105',
          loading && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {loading && (
          <span 
            className="mr-2 animate-spin" 
            aria-hidden="true"
            role="status"
          >
            ⏳
          </span>
        )}
        <span className={loading ? 'sr-only' : undefined}>
          {children}
        </span>
        {loading && (
          <span className="sr-only">Chargement en cours...</span>
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
