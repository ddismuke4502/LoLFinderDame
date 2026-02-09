import React from "react";
import { championLoadingUrl, championSquareUrl } from "../services/ddragon";

const ChampionCard = ({ champ, version, viewMode }) => {
  const imgSrc =
    viewMode === "list"
      ? championLoadingUrl(version, champ.id) 
      : championSquareUrl(version, champ.id); 

  return (
    <article className={`card ${viewMode === "list" ? "card--list" : ""}`}>
      <div className={`card__img-wrapper ${viewMode === "list" ? "card__img-wrapper--tall" : ""}`}>
        <img
          className="card__img"
          src={imgSrc}
          alt={champ.name}
          loading="lazy"
        />
      </div>

      <div className="card__body">
        <div className="card__name">{champ.name}</div>
        <div className="card__title">{champ.title}</div>

        <div className="card__meta">
          <div className="card__tagsRow">
            {(champ.tags || []).map((t) => (
              <span key={t} className={`tagPill tag--${t}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChampionCard;