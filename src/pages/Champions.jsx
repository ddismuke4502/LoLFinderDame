import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import FilterBar from "../components/FilterBar";
import ChampionCard from "../components/ChampionCard";
import { getAllChampions } from "../services/ddragon";

const Champions = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allChamps, setAllChamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [role, setRole] = useState(searchParams.get("role") ?? "All");
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") ?? "Any"
  );

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("lolfinder_viewMode") ?? "grid"; // "grid" | "list"
  });

  useEffect(() => {
    localStorage.setItem("lolfinder_viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    setSearchText(searchParams.get("q") ?? "");
    setRole(searchParams.get("role") ?? "All");
    setDifficulty(searchParams.get("difficulty") ?? "Any");
  }, [searchParams]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const list = await getAllChampions();
        if (!alive) return;

        const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
        setAllChamps(sorted);
      } catch (e) {
        console.error("Failed to load champions:", e);
        if (alive) setAllChamps([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return allChamps.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const title = (c.title ?? "").toLowerCase();
      const tags = (c.tags ?? []).map((t) => t.toLowerCase());

      const matchesQuery =
        !q || name.includes(q) || title.includes(q) || tags.some((t) => t.includes(q));

      const matchesRole = role === "All" || (c.tags ?? []).includes(role);

      const champDifficulty = c.info?.difficulty ?? null;
      const matchesDifficulty =
        difficulty === "Any" ||
        champDifficulty == null ||
        String(champDifficulty) === String(difficulty);

      return matchesQuery && matchesRole && matchesDifficulty;
    });
  }, [allChamps, searchText, role, difficulty]);

  const onApplyFiltersToUrl = () => {
    const next = {};
    if (searchText.trim()) next.q = searchText.trim();
    if (role !== "All") next.role = role;
    if (difficulty !== "Any") next.difficulty = difficulty;
    setSearchParams(next);
  };

  const onReset = () => {
    setSearchText("");
    setRole("All");
    setDifficulty("Any");
    setSearchParams({});
  };

  const version = allChamps?.[0]?.__version; 

  return (
    <main className="page page--champions">
      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        role={role}
        setRole={setRole}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onApply={onApplyFiltersToUrl}
        onReset={onReset}
        count={filtered.length}
        loading={loading}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Skeletons */}
      {loading ? (
        <section className="skeleton-grid">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--short" />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={`card-grid ${viewMode === "list" ? "card-grid--list" : ""}`}>
          {filtered.map((champ) => (
            <Link
              key={champ.id}
              to={`/champions/${champ.id}`}
              state={{ backgroundLocation: location, version }}
              style={{ textDecoration: "none" }}
            >
              <ChampionCard champ={champ} version={version} viewMode={viewMode} />
            </Link>
          ))}
        </section>
      )}
    </main>
  );
};

export default Champions;