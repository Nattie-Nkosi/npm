// src/hooks/useRateLimiter.ts
import { useRef, useCallback } from 'react';

interface UseRateLimiterOptions {
  maxRequests: number;
  timeWindow: number;
}

export function useRateLimiter({ maxRequests, timeWindow }: UseRateLimiterOptions) {
  const requestsRef = useRef<number[]>([]);

  const checkLimit = useCallback(async () => {
    const now = Date.now();
    requestsRef.current = requestsRef.current.filter(
      timestamp => now - timestamp < timeWindow
    );

    if (requestsRef.current.length >= maxRequests) {
      const oldestRequest = requestsRef.current[0];
      const waitTime = timeWindow - (now - oldestRequest);
      throw new Error(`429 Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds`);
    }

    requestsRef.current.push(now);
  }, [maxRequests, timeWindow]);

  return { checkLimit };
}