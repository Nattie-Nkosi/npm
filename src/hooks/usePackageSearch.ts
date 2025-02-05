// src/hooks/usePackageSearch.ts
import { useState, useCallback } from 'react';
import { searchPackages } from '../api/queries/searchPackages';
import type { PackageSummary } from "../api/types/packageSummary";

interface SearchState {
  data: PackageSummary[] | null;
  loading: boolean;
  error: string | null;
}

export function usePackageSearch() {
  const [state, setState] = useState<SearchState>({
    data: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async (term: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await searchPackages(term);
      setState({
        data: results,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }, []);

  return { ...state, search };
}