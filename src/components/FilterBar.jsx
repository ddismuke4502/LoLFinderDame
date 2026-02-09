import React from "react";

const FilterBar = ({
  searchText,
  setSearchText,
  role,
  setRole,
  difficulty,
  setDifficulty,
  onApply,
  onReset,
  count,
  loading,
  viewMode,
  onChangeViewMode,
}) => {
  return (
    <header className="filterBar">
      <div className="filterBar__left">
        <input
          className="filterInput"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search champions…"
        />

        <select
          className="filterSelect"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Fighter">Fighter</option>
          <option value="Mage">Mage</option>
          <option value="Assassin">Assassin</option>
          <option value="Marksman">Marksman</option>
          <option value="Support">Support</option>
          <option value="Tank">Tank</option>
        </select>

        <select
          className="filterSelect"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Any">Any difficulty</option>
          {Array.from({ length: 10 }).map((_, i) => {
            const val = String(i + 1);
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>

        <button className="btn btn--ghost" onClick={onApply} disabled={loading}>
          Apply
        </button>
        <button className="btn btn--ghost" onClick={onReset} disabled={loading}>
          Reset
        </button>

        <div className="viewToggle">
          <button
            type="button"
            className={`btn btn--ghost ${viewMode === "grid" ? "isActive" : ""}`}
            onClick={() => onChangeViewMode("grid")}
            disabled={loading}
          >
            Squares
          </button>
          <button
            type="button"
            className={`btn btn--ghost ${viewMode === "list" ? "isActive" : ""}`}
            onClick={() => onChangeViewMode("list")}
            disabled={loading}
          >
            Vertical
          </button>
        </div>
      </div>

      <div className="filterBar__right">
        {loading ? <span className="muted">Loading...</span> : <span>{count} champs</span>}
      </div>
    </header>
  );
};

export default FilterBar;