
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameStateFromSupabase } from '@/hooks/useGameStateFromSupabase';

// Mock Supabase avec simulation d'erreurs réseau
const mockSupabase = {
  from: vi.fn(),
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      on: vi.fn(() => ({
        on: vi.fn(() => ({
          subscribe: vi.fn()
        }))
      }))
    }))
  })),
  removeChannel: vi.fn()
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useGameStateFromSupabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle network errors with retry logic', async () => {
    let callCount = 0;
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => {
            callCount++;
            if (callCount <= 2) {
              return Promise.reject(new Error('Failed to fetch'));
            }
            return Promise.resolve({
              data: {
                id: 'game-123',
                code: 'ABC123',
                current_round: 1
              },
              error: null
            });
          }
        })
      })
    }));

    const { result } = renderHook(() => useGameStateFromSupabase('ABC123'));

    expect(result.current.loading).toBe(true);

    // Advance timers to trigger retries
    await vi.advanceTimersByTimeAsync(5000);

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(1);
    });
  });

  it('should set timeout for long requests', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => new Promise(() => {}) // Never resolves
        })
      })
    }));

    const { result } = renderHook(() => useGameStateFromSupabase('ABC123'));

    // Advance timers to trigger timeout
    await vi.advanceTimersByTimeAsync(11000);

    await waitFor(() => {
      expect(result.current.error).toContain('Timeout');
    });
  });
});
