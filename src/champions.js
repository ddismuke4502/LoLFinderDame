const DOM = {
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  themeToggle: document.getElementById("themeToggle"),
  difficultyRange: document.getElementById("difficulty-range"),
  difficultyValue: document.getElementById("difficulty-value"),
  roleFilter: document.getElementById("role-filter"),
  championList: document.getElementById("champion-list"),
  resultsCount: document.getElementById("results-count"),
  skeletonGrid: document.getElementById("skeletonGrid"),
  backToTop: document.getElementById("backToTop"),
  navToggle: document.querySelector(".nav__toggle"),
  navMobile: document.getElementById("nav-mobile"),
  contactModal: document.getElementById("contactModal"),
  contactPanel: document.querySelector("#contactModal .modal__panel"),
  contactRightTrack: document.getElementById("contactRightTrack"),
  contactForm: document.getElementById("contactForm"),
  contactSubmit: document.getElementById("contactSubmit"),
  contactFormView: document.getElementById("contactFormView"),
  contactSuccessView: document.getElementById("contactSuccessView"),
};

const STATE = {
  champions: [],
  query: "",
  sort: "name-asc",
  maxDifficulty: 10,
  role: "",
  initialLoadDelayMs: 900,
  debounceMs: 350,
  interFilterLoadMs: 250,
};

function debounce(fn, delay) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function setTheme(isLight) {
  document.body.classList.toggle("theme--light", isLight);
  localStorage.setItem("lolTheme", isLight ? "light" : "dark");

  if (DOM.themeToggle) {
    DOM.themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
}

function initTheme() {
  const saved = localStorage.getItem("lolTheme");
  const isLight = saved === "light";
  setTheme(isLight);
}


/* Loading states */

function showSkeletons(count = 8) {
  if (!DOM.skeletonGrid || !DOM.championList) return;

  DOM.championList.classList.add("is-hidden");
  DOM.skeletonGrid.classList.remove("is-hidden");
  DOM.skeletonGrid.innerHTML = "";

  const cards = Array.from({ length: count })
    .map(
      () => `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--subtitle"></div>
          <div class="skeleton-line skeleton-line--meta"></div>
          <div class="skeleton-bar"></div>
        </div>
      </div>
    `
    )
    .join("");

  DOM.skeletonGrid.innerHTML = cards;
}

function hideSkeletons() {
  if (!DOM.skeletonGrid || !DOM.championList) return;
  DOM.skeletonGrid.classList.add("is-hidden");
  DOM.skeletonGrid.innerHTML = "";
  DOM.championList.classList.remove("is-hidden");
}

/* Data Dragon Fetch API */

async function fetchLatestVersion() {
  const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  if (!res.ok) throw new Error("Failed to fetch versions");
  const versions = await res.json();
  return versions[0];
}

async function fetchChampions(version) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch champion list");
  const data = await res.json();
  return Object.values(data.data);
}

/* Filtering & Sorting */

function normalize(str) {
  return String(str || "").toLowerCase().trim();
}

function getFilteredChampions() {
  const q = normalize(STATE.query);
  const role = normalize(STATE.role);

  let list = STATE.champions.filter((c) => {
    const nameMatch = normalize(c.name).includes(q);
    const roleMatch =
      !role || (c.tags || []).some((t) => normalize(t) === role);
    const difficultyMatch = (c.info?.difficulty ?? 10) <= STATE.maxDifficulty;
    return nameMatch && roleMatch && difficultyMatch;
  });

  // sorting stuff like from the exercises
  const sort = STATE.sort;
  if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "difficulty-asc")
    list.sort((a, b) => (b.info?.difficulty ?? 0) - (a.info?.difficulty ?? 0));
  if (sort === "difficulty-desc")
    list.sort((a, b) => (a.info?.difficulty ?? 0) - (b.info?.difficulty ?? 0));

  return list;
}

/* the rendering */

function championCardHTML(champ) {
  const difficulty = champ.info?.difficulty ?? 0;
  const tags = champ.tags || [];
  const roleLabel = tags.length ? tags.join(" • ") : "Unknown";

  const difficultyPct = Math.max(0, Math.min(10, difficulty)) * 10;

  return `
    <article class="card">
      <div class="card__img-wrapper">
        <img
          class="card__img"
          src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg"
          alt="${champ.name}"
          loading="lazy"
        />
        <span class="card__badge">${roleLabel}</span>
      </div>

      <div class="card__body">
        <div class="card__title-row">
          <h3 class="card__name">${champ.name}</h3>
          <span class="card__title">${champ.title}</span>
        </div>

        <div class="card__meta">
          <span class="card__difficulty">Difficulty: ${difficulty}/10</span>
          <span class="card__difficulty">Attack: ${champ.info?.attack ?? 0}</span>
        </div>

        <div class="card__difficulty-bar">
          <div class="card__difficulty-fill" style="width: ${difficultyPct}%"></div>
        </div>
      </div>
    </article>
  `;
}

function renderChampions(list) {
  if (!DOM.championList) return;

  if (!list.length) {
    DOM.championList.innerHTML = `<p class="results__count">No champions match your filters.</p>`;
  } else {
    DOM.championList.innerHTML = list.map(championCardHTML).join("");
  }

  if (DOM.resultsCount) {
    const noun = list.length === 1 ? "champion" : "champions";
    DOM.resultsCount.textContent = `${list.length} ${noun}`;
  }
}

/* loading state */

let interFilterTimer = null;

function scheduleRenderWithBriefLoading() {
  clearTimeout(interFilterTimer);

  showSkeletons(8);
  interFilterTimer = setTimeout(() => {
    const list = getFilteredChampions();
    hideSkeletons();
    renderChampions(list);
  }, STATE.interFilterLoadMs);
}

/* Events */

const debouncedSearch = debounce(() => {
  STATE.query = DOM.searchInput ? DOM.searchInput.value : "";
  scheduleRenderWithBriefLoading();
}, STATE.debounceMs);

function wireEvents() {

  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("theme--light");
      setTheme(!isLight);
    });
  }

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener("input", () => {
      debouncedSearch();
    });
  }

  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener("change", (e) => {
      STATE.sort = e.target.value;
      scheduleRenderWithBriefLoading();
    });
  }

  if (DOM.difficultyRange) {
    DOM.difficultyRange.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      STATE.maxDifficulty = v;
      if (DOM.difficultyValue) DOM.difficultyValue.textContent = String(v);
      scheduleRenderWithBriefLoading();
    });
  }

  // Role filter
  if (DOM.roleFilter) {
    DOM.roleFilter.addEventListener("change", (e) => {
      STATE.role = e.target.value || "";
      scheduleRenderWithBriefLoading();
    });
  }

  // Mobile nav toggle
  if (DOM.navToggle && DOM.navMobile) {
    DOM.navToggle.addEventListener("click", () => {
      DOM.navToggle.classList.toggle("nav__toggle--open");
      DOM.navMobile.classList.toggle("nav__mobile--open");
    });

    DOM.navMobile.addEventListener("click", (e) => {
      const isLink = e.target.classList.contains("nav__mobile-link");
      if (!isLink) return;
      DOM.navToggle.classList.remove("nav__toggle--open");
      DOM.navMobile.classList.remove("nav__mobile--open");
    });
  }

  // Going Back to the Top
  if (DOM.backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) DOM.backToTop.classList.add("show");
      else DOM.backToTop.classList.remove("show");
    });

    DOM.backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll('a[href="#contact"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (DOM.contactModal) {
    DOM.contactModal.addEventListener("click", (e) => {
      const close = e.target.closest("[data-modal-close]");
      if (close) closeContactModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.contactModal.classList.contains("modal--open")) {
        closeContactModal();
      }
    });
  }

  // Contact modal: submit (EmailJS + slide success)
  if (DOM.contactForm) {
    DOM.contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (DOM.contactSubmit) {
        DOM.contactSubmit.classList.add("is-loading");
        DOM.contactSubmit.disabled = true;
      }

      try {
        await emailjs.sendForm(
          "service_nl16dql",
          "template_p4rqclu",
          DOM.contactForm
        );

        if (DOM.contactPanel) {
          DOM.contactPanel.classList.add("is-success");
        }
      } catch (err) {
        console.error(err);
        alert("Email failed to send. Please try again in a moment.");
      } finally {
        if (DOM.contactSubmit) {
          DOM.contactSubmit.classList.remove("is-loading");
          DOM.contactSubmit.disabled = false;
        }
      }
    });
  }
}

/* Modal */

function openContactModal() {
  if (!DOM.contactModal) return;

  if (DOM.contactPanel) DOM.contactPanel.classList.remove("is-success");
  if (DOM.contactForm) DOM.contactForm.reset();

  DOM.contactModal.classList.add("modal--open");
  DOM.contactModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");
}

function closeContactModal() {
  if (!DOM.contactModal) return;

  DOM.contactModal.classList.remove("modal--open");
  DOM.contactModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-modal-open");
  if (DOM.contactPanel) DOM.contactPanel.classList.remove("is-success");

}


async function init() {
  initTheme();
  wireEvents();
  showSkeletons(8);

  try {
    const version = await fetchLatestVersion();
    const champs = await fetchChampions(version);

    await new Promise((r) => setTimeout(r, STATE.initialLoadDelayMs));

    STATE.champions = champs;

    hideSkeletons();
    renderChampions(getFilteredChampions());

    if (DOM.difficultyValue && DOM.difficultyRange) {
      DOM.difficultyValue.textContent = String(DOM.difficultyRange.value);
    }
  } catch (err) {
    hideSkeletons();
    if (DOM.championList) {
      DOM.championList.innerHTML = `<p class="results__count">Failed to load champions. Please refresh.</p>`;
    }
    console.error(err);
  }
}

init();