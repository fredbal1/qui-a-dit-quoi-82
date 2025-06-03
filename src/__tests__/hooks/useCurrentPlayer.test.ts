
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCurrentPlayer } from '@/hooks/useCurrentPlayer';

const mockSupabase = {
  auth: {
    getUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ 
            data: { 
              id: 'player-123', 
              user_id: 'user-123', 
              game_id: 'game-123',
              is_host: true,
              score: 150
            }, 
            error: null 
          }))
        }))
      }))
    }))
  })),
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      subscribe: vi.fn()
    }))
  })),
  removeChannel: vi.fn()
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('useCurrentPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } }
    });
  });

  it('should fetch current player data', async () => {
    const { result } = renderHook(() => useCurrentPlayer('game-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.player).toEqual({
      id: 'player-123',
      user_id: 'user-123',
      game_id: 'game-123',
      is_host: true,
      score: 150
    });
  });

  it('should handle user not found error', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null }
    });

    const { result } = renderHook(() => useCurrentPlayer('game-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});
