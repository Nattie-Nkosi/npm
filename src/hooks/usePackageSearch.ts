// src/hooks/usePackageSearch.ts
import { useState, useCallback, useEffect } from 'react';
import { searchPackages } from '../api/queries/searchPackages';
import type { PackageSummary } from "../api/types/packageSummary";

interface SearchState {
	data: PackageSummary[] | null;
	loading: boolean;
	error: string | null;
}

export function usePackageSearch(initialTerm?: string) {
	const [state, setState] = useState<SearchState>({
		data: null,
		loading: initialTerm ? true : false,
		error: null,
	});

	const [searchTerm, setSearchTerm] = useState<string | null>(initialTerm || null);
	const [abortController, setAbortController] = useState<AbortController | null>(null);

	// Function to perform search
	const search = useCallback(async (term: string) => {
		// Trim the term and validate
		const trimmedTerm = term.trim();
		if (!trimmedTerm) {
			setState(prev => ({
				...prev,
				error: "Search term is required",
				loading: false,
				data: null
			}));
			return;
		}

		// Update search term state
		setSearchTerm(trimmedTerm);

		// Cancel any pending searches
		if (abortController) {
			abortController.abort();
		}

		// Create new abort controller
		const controller = new AbortController();
		setAbortController(controller);

		// Set loading state
		setState(prev => ({ ...prev, loading: true, error: null }));

		try {
			const results = await searchPackages(trimmedTerm);

			// Check if this search was aborted before updating state
			if (controller.signal.aborted) {
				return;
			}

			setState({
				data: results,
				loading: false,
				error: null,
			});
		} catch (error) {
			// Check if this search was aborted
			if (controller.signal.aborted) {
				return;
			}

			console.error('Search error:', error);
			setState({
				data: null,
				loading: false,
				error: error instanceof Error ? error.message : 'An unexpected error occurred',
			});
		} finally {
			// Clear the abort controller
			setAbortController(null);
		}
	}, []);

	// Clear search results
	const clearSearch = useCallback(() => {
		// Cancel any pending searches
		if (abortController) {
			abortController.abort();
			setAbortController(null);
		}

		setSearchTerm(null);
		setState({
			data: null,
			loading: false,
			error: null,
		});
	}, [abortController]);

	// Perform initial search if initialTerm was provided
	useEffect(() => {
		if (initialTerm) {
			search(initialTerm);
		}

		// Clean up on unmount
		return () => {
			if (abortController) {
				abortController.abort();
			}
		};
	}, [initialTerm]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		...state,
		search,
		clearSearch,
		searchTerm
	};
}

// Custom hook for persisting and retrieving search history
export function useSearchHistory(maxItems = 10) {
	// Initialize from localStorage if available
	const [history, setHistory] = useState<string[]>(() => {
		try {
			const savedHistory = localStorage.getItem('search_history');
			return savedHistory ? JSON.parse(savedHistory) : [];
		} catch (error) {
			console.error('Error loading search history:', error);
			return [];
		}
	});

	// Add a search term to history
	const addToHistory = useCallback((term: string) => {
		setHistory(prevHistory => {
			// Don't add empty terms
			if (!term.trim()) return prevHistory;

			// Remove the term if it already exists (to avoid duplicates)
			const filteredHistory = prevHistory.filter(
				item => item.toLowerCase() !== term.toLowerCase()
			);

			// Add the new term at the beginning
			const newHistory = [term, ...filteredHistory].slice(0, maxItems);

			// Save to localStorage
			try {
				localStorage.setItem('search_history', JSON.stringify(newHistory));
			} catch (error) {
				console.error('Error saving search history:', error);
			}

			return newHistory;
		});
	}, [maxItems]);

	// Clear the entire history
	const clearHistory = useCallback(() => {
		try {
			localStorage.removeItem('search_history');
		} catch (error) {
			console.error('Error clearing search history:', error);
		}
		setHistory([]);
	}, []);

	return { history, addToHistory, clearHistory };
}