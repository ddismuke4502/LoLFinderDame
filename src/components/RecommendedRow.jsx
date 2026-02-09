import React from "react";
import { Link, useLocation } from "react-router-dom";
import ChampionCard from "./ChampionCard";

const RecommendedRow = ({
  items,
  version,
  viewMode = "grid",
  showTitle = true,
}) => {
  const location = useLocation();

  if (!items?.length) return null;

  return (
    <section className="recommended">
      {showTitle && (
        <h2 className="recommended__title">Recommended Champions</h2>
      )}

      <div className="recommended__row">
        {items.map((c) => (
          <Link
            key={c.id ?? c.key ?? c.name}
            to={`/champions/${c.id}`}
            state={{ backgroundLocation: location, version: version ?? c.__version }}
            style={{ textDecoration: "none" }}
          >
            <div className="recommended__item">
              <ChampionCard
                champ={c}
                version={version ?? c.__version}
                viewMode={viewMode}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedRow;