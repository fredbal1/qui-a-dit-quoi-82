
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import GlassCard from '@/components/GlassCard';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <GlassCard>
        <p>Test content</p>
      </GlassCard>
    );
    
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlassCard className="custom-class">
        <p>Test</p>
      </GlassCard>
    );
    
    const glassCard = container.firstChild as HTMLElement;
    expect(glassCard).toHaveClass('custom-class');
    expect(glassCard).toHaveClass('glass-card');
  });

  it('handles click events when onClick is provided', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    const { getByText } = render(
      <GlassCard onClick={handleClick}>
        <p>Clickable card</p>
      </GlassCard>
    );
    
    const card = getByText('Clickable card').parentElement;
    await user.click(card!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover styles when hover prop is true', () => {
    const { container } = render(
      <GlassCard hover>
        <p>Hover card</p>
      </GlassCard>
    );
    
    const glassCard = container.firstChild as HTMLElement;
    expect(glassCard).toHaveClass('glass-button');
    expect(glassCard).toHaveClass('cursor-pointer');
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <GlassCard style={customStyle}>
        <p>Styled card</p>
      </GlassCard>
    );
    
    const glassCard = container.firstChild as HTMLElement;
    expect(glassCard).toHaveStyle('background-color: red');
  });
});
