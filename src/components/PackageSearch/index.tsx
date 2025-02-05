// src/components/PackageSearch/index.tsx
import React, { useState } from "react";
import { Loading } from "../Loading";
import { Feedback } from "../Feedback";
import { usePackageSearch } from "../../hooks/usePackageSearch";

export function PackageSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, search } = usePackageSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await search(searchTerm);
    }
  };

  return (
    <div className="package-search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for packages..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <Loading message="Searching packages..." />}

      {error && (
        <Feedback
          type="error"
          message={error}
          onRetry={() => search(searchTerm)}
        />
      )}

      {data && (
        <div className="results-container">
          {data.map((pkg) => (
            <div key={pkg.name} className="package-item">
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <span className="version">v{pkg.version}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
