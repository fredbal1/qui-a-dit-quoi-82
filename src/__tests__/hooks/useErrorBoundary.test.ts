
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useErrorBoundary } from '@/hooks/useErrorBoundary';

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorBoundary());

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.errorInfo).toBe(null);
  });

  it('should capture and set error state', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError, 'Test error info');
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(testError);
    expect(result.current.errorInfo).toBe('Test error info');
  });

  it('should reset error state', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.resetError();
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.errorInfo).toBe(null);
  });

  it('should auto-reset after 3 seconds', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.hasError).toBe(false);
  });
});
