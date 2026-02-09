const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";

let cachedVersion = null;

export async function getLatestVersion() {
  if (cachedVersion) return cachedVersion;

  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`);
  if (!res.ok) throw new Error("Failed to fetch ddragon versions");
  const versions = await res.json();

  cachedVersion = versions[0];
  return cachedVersion;
}

export function championSquareUrl(version, champId) {
  return `${DDRAGON_BASE}/cdn/${version}/img/champion/${champId}.png`;
}

export function championLoadingUrl(version, champId) {
  return `${DDRAGON_BASE}/cdn/img/champion/loading/${champId}_0.jpg`;
}

export function championSplashUrl(champId, skinNum = 0) {
  return `${DDRAGON_BASE}/cdn/img/champion/splash/${champId}_${skinNum}.jpg`;
}

export function spellIconUrl(version, spellImageFull) {
  return `${DDRAGON_BASE}/cdn/${version}/img/spell/${spellImageFull}`;
}

export function passiveIconUrl(version, passiveImageFull) {
  return `${DDRAGON_BASE}/cdn/${version}/img/passive/${passiveImageFull}`;
}


export async function getAllChampions(version) {
  const v = version ?? (await getLatestVersion());

  const res = await fetch(`${DDRAGON_BASE}/cdn/${v}/data/en_US/champion.json`);
  if (!res.ok) throw new Error("Failed to fetch champion list");
  const json = await res.json();

  const list = Object.values(json.data);

  return list.map((c) => ({
    ...c,
    __version: v,
    imageUrl: championSquareUrl(v, c.id),
  }));
}

export async function getChampionDetails(champId, version) {
  const v = version ?? (await getLatestVersion());

  const res = await fetch(
    `${DDRAGON_BASE}/cdn/${v}/data/en_US/champion/${champId}.json`
  );
  if (!res.ok) throw new Error("Failed to fetch champion details");

  const json = await res.json();
  const details = json.data?.[champId];
  if (!details) throw new Error(`Champion details not found for ${champId}`);

  const skinNum = Number(details.skins?.[0]?.num ?? 0);

  return {
    ...details,
    __version: v,
    imageUrl: championSquareUrl(v, details.id),
    splashUrl: championSplashUrl(details.id, skinNum),

    passive: details.passive
      ? {
          ...details.passive,
          iconUrl: passiveIconUrl(v, details.passive?.image?.full),
        }
      : details.passive,

    spells: (details.spells ?? []).map((s) => ({
      ...s,
      iconUrl: spellIconUrl(v, s?.image?.full),
    })),
  };
}