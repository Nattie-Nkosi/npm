// src/hooks/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiOptions {
  maxRetries?: number;
  retryDelay?: number;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const data = await apiCall();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        attempts++;

        if (error instanceof Error) {
          if (error.message.includes('429')) {
            const waitTime = parseInt(error.message) || retryDelay;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }

          if (attempts === maxRetries) {
            setState({ data: null, loading: false, error });
          } else {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
    }
  }, [apiCall, maxRetries, retryDelay]);

  return { ...state, execute };
}