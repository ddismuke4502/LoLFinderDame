import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const goBrowse = () => navigate("/champions");

  const goToChampion = () => {
    const search = q.trim();

    if (search) {
      navigate(`/champions?q=${encodeURIComponent(search)}`);
    } else {
      navigate("/champions");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") goToChampion();
    if (e.key === "Escape") setQ("");
  };

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__brandRow">
          <LoLFinderIcon className="home__logo" />
          <div className="home__brandText">
            <div className="home__brandName">LOLFINDER</div>
            <div className="home__brandTag">Find your next main.</div>
          </div>
        </div>

        <h1 className="home__title">Find your next main.</h1>
        <p className="home__subtitle">
          Search champions, filter by role &amp; difficulty, dive into details,
          and get recommendations.
        </p>

        <div className="home__search">
          <input
            className="home__input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search a champion (e.g., Ahri, AurelionSol, KaiSa)"
            aria-label="Champion search"
          />

          <button className="home__cta" onClick={goToChampion}>
            Browse
          </button>
        </div>

        <div className="home__hint">
          Tip: Press <span className="home__kbd">Enter</span> to open champion
          details. <span className="home__kbd">Esc</span> clears. Or{" "}
          <button className="home__linkBtn" onClick={goBrowse}>
            browse all champions
          </button>
          .
        </div>
      </section>
    </main>
  );
}

function LoLFinderIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="44"
      height="44"
      viewBox="0 0 64 64"
      role="img"
      aria-label="LoLFinder icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC400" />
          <stop offset="0.55" stopColor="#FF9900" />
          <stop offset="1" stopColor="#FF5A1F" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer badge */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="14"
        fill="rgba(0,0,0,0.55)"
        stroke="url(#gold)"
        strokeWidth="2"
      />

      {/* Magnifier */}
      <g filter="url(#glow)">
        <circle
          cx="30"
          cy="30"
          r="12"
          fill="none"
          stroke="url(#gold)"
          strokeWidth="4"
        />
        <path
          d="M39 39 L49 49"
          stroke="url(#gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* “LF” hint mark */}
      <path d="M18 46 V36 H22 V42 H28 V46 Z" fill="rgba(255,255,255,0.85)" />
      <path
        d="M30 46 V36 H40 V39 H34 V40.5 H39 V43.5 H34 V46 Z"
        fill="rgba(255,255,255,0.85)"
      />
    </svg>
  );
}
