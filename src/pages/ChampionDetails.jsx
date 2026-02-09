import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import RecommendedRow from "../components/RecommendedRow";
import { getAllChampions, getChampionDetails } from "../services/ddragon";

const stripHtml = (s = "") => s.replace(/<\/?[^>]+(>|$)/g, "");

// 3D model (Khada / modelviewer.lol)
const khadaSlugFromChampId = (champId) =>
  (champId ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

const khadaChampionUrl = (champId) =>
  `https://modelviewer.lol/champions/${khadaSlugFromChampId(champId)}`;

const ChampionDetails = () => {
  const { id } = useParams();

  const [champ, setChamp] = useState(null);
  const [allChamps, setAllChamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const [list, details] = await Promise.all([
          getAllChampions(),
          getChampionDetails(id),
        ]);

        if (!alive) return;
        setAllChamps(list);
        setChamp(details);
      } catch (e) {
        console.error("ChampionDetails load failed:", e);
        if (!alive) return;
        setChamp(null);
        setAllChamps([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const recommended = useMemo(() => {
    if (!champ) return [];

    const champTags = new Set(champ.tags ?? []);
    const baseDifficulty = champ.info?.difficulty ?? null;

    const score = (c) => {
      if (!c) return -999;
      if (c.id === champ.id) return -999;

      let s = 0;

      (c.tags ?? []).forEach((t) => {
        if (champTags.has(t)) s += 10;
      });

      const d = c.info?.difficulty ?? null;
      if (baseDifficulty != null && d != null) {
        s += Math.max(0, 5 - Math.abs(Number(baseDifficulty) - Number(d)));
      }

      return s;
    };

    return [...allChamps]
      .map((c) => ({ c, s: score(c) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.c);
  }, [champ, allChamps]);

  // skeletons
  if (loading) {
    return (
      <main className="page page--details">
        <div style={{ marginBottom: 12 }}>
          <Link to="/champions">← Back to Browse</Link>
        </div>

        <div className="detailsSkeleton">
          <div className="sk sk-hero" />
          <div className="sk sk-line" />
          <div className="sk sk-line sk-line--short" />

          <div style={{ marginTop: 16 }}>
            <div className="sk sk-line" />
            <div className="sk sk-line sk-line--short" />
          </div>

          <div style={{ marginTop: 18 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="sk-abilityRow">
                <div className="sk sk-icon" />
                <div style={{ flex: 1 }}>
                  <div className="sk sk-line" />
                  <div className="sk sk-line sk-line--short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!champ) {
    return (
      <main className="page page--details">
        <p>Champion not found.</p>
        <Link to="/champions">← Back to Browse</Link>
      </main>
    );
  }

  return (
    <main className="page page--details">
      <div style={{ marginBottom: 12 }}>
        <Link to="/champions">← Back to Browse</Link>
      </div>

      <h1 style={{ margin: 0 }}>{champ.name}</h1>
      <div className="muted">{champ.title}</div>
      <div className="muted" style={{ marginBottom: 10 }}>
        {(champ.tags ?? []).join(" / ")}
      </div>

      <a
        href={khadaChampionUrl(champ.id)}
        target="_blank"
        rel="noreferrer"
        className="btn btn--ghost"
        style={{ display: "inline-block", margin: "6px 0 14px" }}
      >
        View 3D Models of {champ.name} skins
      </a>

      {champ.splashUrl && (
        <img
          src={champ.splashUrl}
          alt={champ.name}
          style={{
            width: "100%",
            maxWidth: 1100,
            borderRadius: 12,
            display: "block",
          }}
        />
      )}

      <section style={{ marginTop: 16 }}>
        <h2>Overview</h2>
        <p className="muted">{champ.lore}</p>
        <div className="muted">
          Attack: {champ.info?.attack} · Defense: {champ.info?.defense} · Magic:{" "}
          {champ.info?.magic} · Difficulty: {champ.info?.difficulty}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Abilities</h2>

        {champ.passive && (
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            {champ.passive.iconUrl && (
              <img
                src={champ.passive.iconUrl}
                alt={champ.passive.name}
                style={{ width: 44, height: 44, borderRadius: 10 }}
              />
            )}
            <div>
              <div style={{ fontWeight: 700 }}>
                Passive: {champ.passive.name}
              </div>
              <div className="muted">{stripHtml(champ.passive.description)}</div>
            </div>
          </div>
        )}

        {(champ.spells ?? []).map((s, idx) => (
          <div
            key={s.id ?? idx}
            style={{ display: "flex", gap: 12, marginBottom: 14 }}
          >
            {s.iconUrl && (
              <img
                src={s.iconUrl}
                alt={s.name}
                style={{ width: 44, height: 44, borderRadius: 10 }}
              />
            )}
            <div>
              <div style={{ fontWeight: 700 }}>
                {["Q", "W", "E", "R"][idx]}: {s.name}
              </div>
              <div className="muted">{stripHtml(s.description)}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 18 }}>
        <RecommendedRow items={recommended} />
      </section>
    </main>
  );
};

export default ChampionDetails;