/* ---------- Configuration ---------- */
const API_KEY = (window.APP_CONFIG && window.APP_CONFIG.googleBooksApiKey) || "";   /* définie dans config.js */
const STORE = "ma-bibliotheque-v2";
const OLD_KEY = "ma-bibliotheque";
const t = I18N.t;   /* traduction : voir i18n.js */

/* ---------- Données : plusieurs bibliothèques, stockées dans le navigateur ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
let state = { libs: [], currentId: null };
try {
  const s = JSON.parse(localStorage.getItem(STORE));
  if (s && Array.isArray(s.libs)) state = s;
} catch (e) {}

/* Reprise des livres de l'ancienne version (une seule bibliothèque) */
if (!state.libs.length) {
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY));
    if (Array.isArray(old) && old.length) {
      state.libs.push({ id: uid(), name: t("defaultLibName"), books: old });
      state.currentId = state.libs[0].id;
    }
  } catch (e) {}
}
/* Première visite (rien d'enregistré, ni ancienne ni nouvelle version) : on propose une bibliothèque d'exemple */
let firstVisit = false;
try { firstVisit = localStorage.getItem(STORE) === null && localStorage.getItem(OLD_KEY) === null; } catch (e) {}
if (firstVisit && !state.libs.length && window.DEMO_LIBRARY) {
  const d = window.DEMO_LIBRARY[I18N.getLang()] || window.DEMO_LIBRARY.fr;   /* classiques français ou anglais selon la langue */
  state.libs.push({ id: uid(), name: d.name, books: d.books.map(b => ({ ...b, cover: "" })) });
  state.currentId = state.libs[0].id;
}
state.libs.forEach(l => l.books.forEach(b => {
  if (!b.status) b.status = b.read ? "read" : "unread";
  /* Anciennes versions : les mentions « Sans titre » / « Auteur inconnu » étaient enregistrées dans la langue du moment.
     On les retire pour les afficher dans la langue courante. */
  if (b.title === "Sans titre" || b.title === "Untitled") b.title = "";
  if (b.author === "Auteur inconnu" || b.author === "Unknown author") b.author = "";
}));
if (!state.libs.some(l => l.id === state.currentId)) state.currentId = state.libs[0] ? state.libs[0].id : null;

const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} };
const currentLib = () => state.libs.find(l => l.id === state.currentId) || null;
const books = () => { const l = currentLib(); return l ? l.books : []; };
const saved = id => books().find(b => b.id === id);
const statusLabel = s => t({ unread: "stUnread", reading: "stReading", read: "stRead" }[s]);

/* Affichage des livres : titre, auteur et descriptif de repli dans la langue de l'interface. */
const titleOf = b => b.title || t("untitled");
const authorOf = b => b.author || t("unknownAuthor");
const descOf = b => b.description || t("noDesc");

/* ---------- Raccourcis et état ---------- */
const $ = id => document.getElementById(id);
let libQuery = "", filter = "all", current = null, draft = { status: null, owned: null }, afterCreate = null, editingId = null, delId = null, selectedId = null;

/* ---------- En-tête et menu des bibliothèques ---------- */
const ICON_EDIT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
const ICON_TRASH = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>';

function actionBtn(label, icon, extra, fn) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "lib-act" + extra;
  b.title = label;
  b.setAttribute("aria-label", label);
  b.setAttribute("role", "menuitem");
  b.innerHTML = icon;   /* icône statique, sans donnée saisie */
  b.addEventListener("click", fn);
  return b;
}

/* Réduit la taille du nom pour qu'il tienne toujours dans le cadre */
function fitName() {
  const el = $("libName");
  el.style.fontSize = "";
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth && size > 11) {
    size -= 0.5;
    el.style.fontSize = size + "px";
  }
}
window.addEventListener("resize", fitName);
if (document.fonts) document.fonts.ready.then(fitName);

function renderHeader() {
  renderExportNote();
  const lib = currentLib();
  $("libName").textContent = lib ? lib.name : t("noLibrary");
  /* Bouton « Ma bibliothèque » : recherche dans la bibliothèque active (son nom complet est dans l'infobulle) */
  const sb = $("libSearchBtn");
  sb.hidden = !lib;
  if (lib) {
    sb.textContent = t("searchInLib", { name: lib.name });
    sb.title = t("searchInLibLabel", { name: lib.name });
    sb.setAttribute("aria-label", t("searchInLibLabel", { name: lib.name }));
  }
  fitName();
  const list = $("libList");
  if (!state.libs.length) {
    const p = document.createElement("p");
    p.className = "lib-empty";
    p.textContent = t("noLibraryYet");
    list.replaceChildren(p);
    return;
  }
  list.replaceChildren(...state.libs.map(l => {
    const row = document.createElement("div");
    row.className = "lib-row";
    row.setAttribute("role", "none");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lib-item";
    b.setAttribute("role", "menuitem");
    b.textContent = (l.id === state.currentId ? "✓ " : "") + l.name;
    b.setAttribute("aria-current", l.id === state.currentId);
    b.addEventListener("click", () => {
      state.currentId = l.id;
      resetLibSearch();
      persist();
      closeMenu();
      $("resultsSection").hidden = true;
      renderAll();
    });
    row.append(
      b,
      actionBtn(t("rename"), ICON_EDIT, "", () => { closeMenu(); askRenameLibrary(l.id); }),
      actionBtn(t("remove"), ICON_TRASH, " del", () => { closeMenu(); askDeleteLibrary(l.id); })
    );
    return row;
  }));
}

function closeMenu() {
  $("libMenu").hidden = true;
  $("libBtn").setAttribute("aria-expanded", "false");
}
/* Lignes navigables du menu : « Créer… » puis une ligne par bibliothèque (nom, crayon, corbeille) */
const menuRows = () => [$("newLibBtn"), ...document.querySelectorAll("#libList .lib-row"), $("exportBtn"), $("importBtn")];
function focusRow(i) {
  const rows = menuRows();
  const row = rows[(i + rows.length) % rows.length];
  (row.matches("button") ? row : row.querySelector(".lib-item")).focus();
}
function openMenu() {
  $("libMenu").hidden = false;
  $("libBtn").setAttribute("aria-expanded", "true");
  focusRow(0);
}

$("libBtn").addEventListener("click", e => {
  e.stopPropagation();
  if ($("libMenu").hidden) openMenu(); else closeMenu();
});
/* Flèche bas sur le logo : ouvre le menu */
$("libBtn").addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { e.preventDefault(); if ($("libMenu").hidden) openMenu(); else focusRow(0); }
});
/* Dans le menu : ↑ ↓ changent de ligne, ← → passent du nom au crayon puis à la corbeille, Début / Fin */
$("libMenu").addEventListener("keydown", e => {
  const rows = menuRows();
  const row = e.target.closest(".lib-row") || e.target;
  const i = rows.indexOf(row);
  if (e.key === "ArrowDown") { e.preventDefault(); focusRow(i + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); focusRow(i - 1); }
  else if (e.key === "Home") { e.preventDefault(); focusRow(0); }
  else if (e.key === "End") { e.preventDefault(); focusRow(rows.length - 1); }
  else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && row.matches(".lib-row")) {
    e.preventDefault();
    const btns = [...row.querySelectorAll("button")];
    const j = btns.indexOf(e.target) + (e.key === "ArrowRight" ? 1 : -1);
    if (j >= 0 && j < btns.length) btns[j].focus();
  }
});
document.addEventListener("click", e => { if (!e.target.closest(".brand")) closeMenu(); });
/* Échap ferme le menu et rend le focus au logo */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("libMenu").hidden) { closeMenu(); $("libBtn").focus(); }
});

/* ---------- Création d'une bibliothèque ---------- */
function askNewLibrary(callback) {
  afterCreate = callback || null;
  editingId = null;
  $("libTitle").textContent = t("createLibTitle");
  $("libSubmit").textContent = t("create");
  $("libForm").reset();
  $("libDlg").showModal();
  $("libInput").focus();
}

function askRenameLibrary(id) {
  const l = state.libs.find(x => x.id === id); if (!l) return;
  afterCreate = null;
  editingId = id;
  $("libTitle").textContent = t("renameLibTitle");
  $("libSubmit").textContent = t("save");
  $("libInput").value = l.name;
  $("libDlg").showModal();
  $("libInput").select();
}

function askDeleteLibrary(id) {
  const l = state.libs.find(x => x.id === id); if (!l) return;
  delId = id;
  $("delText").textContent = t(l.books.length === 0 ? "deleteTextEmpty" : l.books.length === 1 ? "deleteText1" : "deleteTextN", { name: l.name, n: l.books.length });
  $("delDlg").showModal();
}
$("delConfirm").addEventListener("click", () => {
  state.libs = state.libs.filter(l => l.id !== delId);
  if (state.currentId === delId) state.currentId = state.libs[0] ? state.libs[0].id : null;
  delId = null;
  resetLibSearch();
  persist();
  $("delDlg").close();
  $("resultsSection").hidden = true;
  renderAll();
});
$("delCancel").addEventListener("click", () => { delId = null; $("delDlg").close(); });
$("delDlg").addEventListener("close", () => { delId = null; });   /* aussi après Échap */
$("delDlg").addEventListener("click", e => { if (e.target === $("delDlg")) { delId = null; $("delDlg").close(); } });
$("newLibBtn").addEventListener("click", () => { closeMenu(); askNewLibrary(); });

$("libForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("libInput").value.trim();
  if (!name) return;
  if (editingId) {   /* mode « renommer » */
    const target = state.libs.find(x => x.id === editingId);
    if (target) target.name = name;
    editingId = null;
    persist();
    $("libDlg").close();
    renderAll();
    return;
  }
  const lib = { id: uid(), name, books: [] };
  state.libs.push(lib);
  state.currentId = lib.id;
  resetLibSearch();
  persist();
  $("libDlg").close();
  $("resultsSection").hidden = true;
  renderAll();
  const cb = afterCreate; afterCreate = null;
  if (cb) cb();
});
$("libCancel").addEventListener("click", () => { afterCreate = null; $("libDlg").close(); });
$("libDlg").addEventListener("close", () => { afterCreate = null; editingId = null; });   /* aussi après Échap */
$("libDlg").addEventListener("click", e => { if (e.target === $("libDlg")) { afterCreate = null; $("libDlg").close(); } });

/* ---------- Recherche Google Books ---------- */
/* Google Books répond parfois par une erreur 500/503 passagère (« backendFailed »). On réessaie jusqu'à 5 fois,
   avec des pauses qui s'allongent ; makeUrl(i) reçoit le numéro de la tentative pour pouvoir alléger la requête. */
const RETRY_DELAYS = [1000, 2000, 4000, 6000];
async function fetchWithRetry(makeUrl, onRetry) {
  let res;
  for (let i = 0; i <= RETRY_DELAYS.length; i++) {
    res = await fetch(makeUrl(i));
    if (res.status !== 500 && res.status !== 503) return res;
    if (i < RETRY_DELAYS.length) {
      if (onRetry) onRetry(i + 2, RETRY_DELAYS.length + 1);
      await new Promise(r => setTimeout(r, RETRY_DELAYS[i]));
    }
  }
  return res;
}

/* Résultats par pages de lignes complètes : ROWS lignes à la fois, puis « Afficher plus ».
   On demande BATCH résultats à Google, on n'affiche que des lignes entières et on garde le reste en réserve ;
   la dernière page peut être incomplète seulement quand il n'y a plus rien à charger. */
const ROWS = 4;
const BATCH = 40;         /* maximum autorisé par l'API Google Books */
const BATCH_SMALL = 20;   /* requête allégée, utilisée dès la 3e tentative après des erreurs */
let search = null;  /* recherche en cours : { q, buffer, start, exhausted, seen } */

/* Nombre de colonnes réellement affichées (même grille que la bibliothèque) */
function visibleColumns() {
  const n = getComputedStyle($("library")).gridTemplateColumns.split(" ").filter(x => x && x !== "none").length;
  return Math.max(1, n);
}

async function fetchInto(s) {
  let used = BATCH;   /* nombre de résultats réellement demandé (la requête s'allège après des échecs) */
  const makeUrl = i => {
    used = i >= 2 ? BATCH_SMALL : BATCH;
    return "https://www.googleapis.com/books/v1/volumes?maxResults=" + used + "&startIndex=" + s.start
      + "&printType=books&q=" + encodeURIComponent(s.q) + (API_KEY ? "&key=" + API_KEY : "");
  };
  const res = await fetchWithRetry(makeUrl, (n, max) => setStatus("retrying", false, { n, max }));
  if (res.status === 400 && s.start > 0) { s.exhausted = true; return; }   /* au-delà de la fin des résultats */
  if (!res.ok) { const er = new Error("http"); er.code = res.status; throw er; }
  const data = await res.json();
  const items = data.items || [];
  s.start += used;
  if (!items.length) s.exhausted = true;
  items.map(toBook).forEach(b => { if (!s.seen.has(b.id)) { s.seen.add(b.id); s.buffer.push(b); } });
}

/* Renvoie les livres de la prochaine page et dit s'il en reste */
async function takePage(s) {
  const size = visibleColumns() * ROWS;
  let guard = 0;
  while (s.buffer.length <= size && !s.exhausted && guard++ < 6) {
    try { await fetchInto(s); }
    catch (err) { if (!s.buffer.length) throw err; break; }   /* on affiche ce qu'on a ; « Afficher plus » permettra de réessayer */
  }
  const items = s.buffer.splice(0, size);
  return { items, hasMore: s.buffer.length > 0 || !s.exhausted };
}

function reportError(err) {
  if (err.code === 429 || err.code === 403) setStatus("errLimit", true, { code: err.code });
  else if (err.code) setStatus("errHttp", true, { code: err.code });
  else setStatus("errNetwork", true);
}

$("searchForm").addEventListener("submit", async e => {
  e.preventDefault();
  const q = $("q").value.trim();
  if (!q) return;
  libQuery = "";
  renderLibrary();
  setStatus("searching");
  const s = search = { q, buffer: [], start: 0, exhausted: false, seen: new Set() };
  try {
    const page = await takePage(s);
    if (s !== search) return;   /* une recherche plus récente a pris le relais */
    showResults(page.items);
    $("moreBtn").hidden = !page.hasMore;
    setStatus(page.items.length ? "" : "noResults");
  } catch (err) {
    if (s === search) reportError(err);
  }
});

$("moreBtn").addEventListener("click", async () => {
  const s = search; if (!s) return;
  $("moreBtn").disabled = true;
  setStatus("searching");
  try {
    const page = await takePage(s);
    if (s !== search) return;
    appendResults(page.items);
    $("moreBtn").hidden = !page.hasMore;
    setStatus(page.items.length ? "" : "noMore");
  } catch (err) {
    if (s === search) reportError(err);
  } finally {
    $("moreBtn").disabled = false;
  }
});

/* Retour à la bibliothèque quand le champ est vidé (croix d'effacement ou texte supprimé) */
$("q").addEventListener("input", () => {
  if ($("q").value === "") { $("resultsSection").hidden = true; setStatus(""); if (libQuery) { libQuery = ""; renderLibrary(); } }
});

/* Le nom de la bibliothèque est un lien vers la bibliothèque */
$("libName").addEventListener("click", () => {
  if (!currentLib()) { askNewLibrary(); return; }
  $("q").value = "";
  libQuery = "";
  $("resultsSection").hidden = true;
  setStatus("");
  filter = "all";
  document.querySelectorAll("#tabs .tab").forEach(x => x.setAttribute("aria-pressed", x.dataset.f === "all"));
  renderLibrary();
  $("tabs").scrollIntoView({ behavior: "smooth", block: "start" });
});

function toBook(item) {
  const v = item.volumeInfo || {};
  const ids = v.industryIdentifiers || [];
  const isbn = (ids.find(x => x.type === "ISBN_13") || ids.find(x => x.type === "ISBN_10") || {}).identifier || "";
  const img = (v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail)) || "";
  return {
    id: item.id,
    title: v.title || "",   /* « Sans titre » / « Auteur inconnu » s'affichent dans la langue de l'interface (titleOf, authorOf) */
    author: (v.authors || []).join(", "),
    year: (v.publishedDate || "").slice(0, 4),
    cover: img.replace("http://", "https://"),
    isbn,
    description: v.description ? v.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : ""
  };
}

/* Message d'état : on garde la clé pour pouvoir le retraduire si la langue change */
let statusState = { key: "", isErr: false, params: null };
function setStatus(key, isErr, params) {
  statusState = { key: key || "", isErr: !!isErr, params: params || null };
  const s = $("status");
  s.textContent = key ? t(key, params) : "";
  s.classList.toggle("err", !!isErr);
}

/* ---------- Affichage ---------- */
function coverPlaceholder(book) {
  const d = document.createElement("div");
  d.className = "cover nocover";
  d.textContent = titleOf(book);
  return d;
}

/* Couverture : Open Library (par ISBN), puis Google Books, puis le titre */
function coverEl(book) {
  const sources = [
    book.isbn ? "https://covers.openlibrary.org/b/isbn/" + book.isbn + "-L.jpg?default=false" : "",
    book.cover
  ].filter(Boolean);
  if (!sources.length) return coverPlaceholder(book);

  const img = document.createElement("img");
  img.className = "cover";
  img.alt = t("coverOf", { title: titleOf(book) });
  let i = 0;
  const next = () => {
    i++;
    if (i < sources.length) img.src = sources[i];
    else img.replaceWith(coverPlaceholder(book));
  };
  img.onerror = next;
  img.onload = () => { if (img.naturalWidth <= 1) next(); };
  img.src = sources[0];
  return img;
}

function badge(text, on) {
  const s = document.createElement("span");
  s.className = "badge" + (on ? "" : " off");
  s.textContent = text;
  return s;
}

function card(book, withBadges) {
  const b = document.createElement("div");   /* la carte n'est plus cliquable : seule la couverture l'est */
  b.className = "book" + (book.id === selectedId ? " selected" : "");
  b.dataset.id = book.id;
  const frame = document.createElement("button");   /* cadre + couverture = zone cliquable */
  frame.type = "button";
  frame.className = "frame";
  frame.setAttribute("aria-label", t("openSheet", { title: titleOf(book) }));
  frame.appendChild(coverEl(book));
  frame.addEventListener("click", () => openBook(book));
  b.appendChild(frame);
  const ti = document.createElement("span"); ti.className = "t"; ti.textContent = titleOf(book);
  const a = document.createElement("span"); a.className = "a"; a.textContent = authorOf(book);
  b.append(ti, a);
  if (withBadges) {
    const w = document.createElement("span"); w.className = "badges";
    w.append(
      badge(statusLabel(book.status), book.status !== "unread"),
      badge(book.owned ? t("owned") : t("notOwned"), book.owned)
    );
    b.appendChild(w);
  }
  return b;
}

let lastFound = [];
const resultCard = b => card(saved(b.id) || b, !!saved(b.id));
function showResults(found) {
  lastFound = found;
  $("results").replaceChildren(...found.map(resultCard));
  $("resultsSection").hidden = !found.length;
}
function appendResults(more) {   /* « Afficher plus » : on ajoute sans recharger les cartes déjà affichées */
  lastFound = lastFound.concat(more);
  $("results").append(...more.map(resultCard));
}
$("closeResults").addEventListener("click", () => { $("resultsSection").hidden = true; });

function renderLibrary() {
  const words = normText(libQuery).split(/\s+/).filter(Boolean);
  const list = books().filter(b =>
    (!words.length || matchesAll(b, words)) && (
    filter === "all" ? true :
    filter === "read" ? b.status === "read" :
    filter === "reading" ? b.status === "reading" :
    filter === "unread" ? b.status === "unread" :
    filter === "owned" ? b.owned : !b.owned));
  const box = $("library");
  if (!list.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = !currentLib() ? t("emptyNoLib") :
      words.length ? t("emptySearch") :
      books().length ? t("emptyFilter") : t("emptyLib");
    box.replaceChildren(p);
    return;
  }
  box.replaceChildren(...list.map(b => card(b, true)));
}

/* ---------- Recherche dans la bibliothèque (sans accents ni majuscules, tous les mots doivent correspondre) ---------- */
const normText = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const matchesAll = (b, words) => {
  const hay = normText([titleOf(b), authorOf(b), b.year, b.isbn].join(" "));
  return words.every(w => hay.includes(w));
};
function updateLibStatus() {
  const lib = currentLib();
  if (!lib || !libQuery) return;
  const n = document.querySelectorAll("#library .book").length;
  setStatus(n === 0 ? "libNone" : n === 1 ? "libFound1" : "libFoundN", false, { n, name: lib.name });
}
function resetLibSearch() { libQuery = ""; $("q").value = ""; setStatus(""); }

$("libSearchBtn").addEventListener("click", () => {
  const lib = currentLib(); if (!lib) return;
  libQuery = $("q").value.trim();
  $("resultsSection").hidden = true;   /* on quitte les résultats Google pour afficher la bibliothèque filtrée */
  renderLibrary();
  updateLibStatus();
  $("tabs").scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderAll() { renderHeader(); renderLibrary(); }

$("tabs").addEventListener("click", e => {
  const tab = e.target.closest(".tab"); if (!tab) return;
  /* Un second clic sur le filtre actif le désélectionne : retour à « Tous » */
  filter = (tab.dataset.f !== "all" && tab.dataset.f === filter) ? "all" : tab.dataset.f;
  document.querySelectorAll("#tabs .tab").forEach(x => x.setAttribute("aria-pressed", x.dataset.f === filter));
  renderLibrary();
  updateLibStatus();
});

/* ---------- Fiche d'un livre ---------- */
function openBook(book) {
  /* Pas encore de bibliothèque : on la crée d'abord, puis on rouvre la fiche */
  if (!currentLib()) { askNewLibrary(() => openBook(book)); return; }
  current = book;
  selectedId = book.id;   /* cadre walnut autour du livre choisi */
  document.querySelectorAll(".book").forEach(el => el.classList.toggle("selected", el.dataset.id === selectedId));
  const s = saved(book.id);
  draft = { status: s ? s.status : null, owned: s ? s.owned : null };
  const f = document.createElement("span");   /* même cadre que sur la page d'accueil (non cliquable ici) */
  f.className = "frame static";
  f.appendChild(coverEl(book));
  $("coverBox").replaceChildren(f);
  $("dTitle").textContent = titleOf(book);
  $("dAuthor").textContent = authorOf(book);
  $("dYear").textContent = book.year;
  $("dDesc").textContent = descOf(book);
  $("dDesc").hidden = true;
  $("descBtn").textContent = t("showDesc");
  $("removeBtn").hidden = !s;
  syncChoices();
  $("dlg").showModal();
}

$("descBtn").addEventListener("click", () => {
  const d = $("dDesc"); d.hidden = !d.hidden;
  $("descBtn").textContent = d.hidden ? t("showDesc") : t("hideDesc");
});

document.querySelectorAll("[data-status]").forEach(b => b.addEventListener("click", () => {
  draft.status = b.dataset.status; syncChoices();
}));
document.querySelectorAll("[data-owned]").forEach(b => b.addEventListener("click", () => {
  draft.owned = b.dataset.owned === "true"; syncChoices();
}));

function syncChoices() {
  document.querySelectorAll("[data-status]").forEach(b =>
    b.setAttribute("aria-pressed", draft.status === b.dataset.status));
  document.querySelectorAll("[data-owned]").forEach(b =>
    b.setAttribute("aria-pressed", draft.owned !== null && String(draft.owned) === b.dataset.owned));
  $("ownStep").hidden = draft.status === null;
  $("saveBtn").disabled = draft.status === null || draft.owned === null;
}

/* Livre « similaire » déjà dans la bibliothèque : même ISBN, ou même titre (ou titre qui commence pareil) avec un auteur commun.
   Une autre édition a un autre identifiant Google, d'où cette comparaison sur le contenu. */
const normTitle = s => normText(s).replace(/[^a-z0-9]+/g, " ").trim();
const authorWords = s => normText(s).split(/[^a-z0-9]+/).filter(w => w.length >= 3);
function findSimilar(b) {
  const nt = normTitle(b.title), aw = authorWords(b.author);
  return books().find(x => {
    if (x.id === b.id) return false;
    if (b.isbn && x.isbn === b.isbn) return true;
    const xt = normTitle(x.title);
    if (!nt || !xt) return false;
    const xw = authorWords(x.author);
    const common = aw.some(w => xw.includes(w));
    if (nt === xt) return !aw.length || !xw.length || common;
    const [short, long] = nt.length <= xt.length ? [nt, xt] : [xt, nt];
    return short.length >= 5 && long.startsWith(short + " ") && common;
  }) || null;
}

function showDuplicate(sim) {
  $("dupText").textContent = t("dupText", { name: currentLib().name });
  const f = document.createElement("span");
  f.className = "frame static";
  f.appendChild(coverEl(sim));
  const info = document.createElement("div");
  const ti = document.createElement("p"); ti.className = "dup-title"; ti.textContent = titleOf(sim);
  const au = document.createElement("p"); au.className = "meta"; au.textContent = [authorOf(sim), sim.year].filter(Boolean).join(" · ");
  const bd = document.createElement("span"); bd.className = "badges";
  bd.append(badge(statusLabel(sim.status), sim.status !== "unread"), badge(sim.owned ? t("owned") : t("notOwned"), sim.owned));
  info.append(ti, au, bd);
  $("dupBox").replaceChildren(f, info);
  $("dupDlg").showModal();
}
$("dupCancel").addEventListener("click", () => $("dupDlg").close());   /* on reste sur la fiche du livre */
$("dupDlg").addEventListener("click", e => { if (e.target === $("dupDlg")) $("dupDlg").close(); });
$("dupAdd").addEventListener("click", () => { $("dupDlg").close(); commitBook(); });

$("saveBtn").addEventListener("click", () => {
  if (current && !saved(current.id)) {   /* nouvel ajout : on prévient s'il en existe un similaire */
    const sim = findSimilar(current);
    if (sim) { showDuplicate(sim); return; }
  }
  commitBook();
});

function commitBook() {
  const lib = currentLib();
  const entry = { ...current, status: draft.status, owned: draft.owned };
  delete entry.read;
  const i = lib.books.findIndex(b => b.id === entry.id);
  if (i >= 0) lib.books[i] = entry; else lib.books.unshift(entry);
  persist();
  renderLibrary();
  $("resultsSection").hidden = true;
  $("dlg").close();
}

$("removeBtn").addEventListener("click", () => {
  const lib = currentLib();
  lib.books = lib.books.filter(b => b.id !== current.id);
  persist();
  renderLibrary();
  $("dlg").close();
});

$("dlg").addEventListener("click", e => { if (e.target === $("dlg")) $("dlg").close(); });

/* ---------- Export / import d'un fichier de sauvegarde (.json) ---------- */
const EXPORT_APP = "ma-bibliotheque";
const LAST_EXPORT_KEY = "ma-bibliotheque-lastexport";
const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

function renderExportNote() {
  let d = null;
  try { d = localStorage.getItem(LAST_EXPORT_KEY); } catch (e) {}
  $("exportNote").textContent = d ? t("lastExport", { date: new Date(d).toLocaleDateString(I18N.getLang()) }) : t("noExport");
}

const pad2 = n => String(n).padStart(2, "0");
$("exportBtn").addEventListener("click", () => {
  closeMenu();
  if (!state.libs.length) { setStatus("nothingToExport"); return; }
  const data = { app: EXPORT_APP, version: 2, exportedAt: new Date().toISOString(), libs: state.libs };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const now = new Date();
  const a = document.createElement("a");
  a.href = url;
  a.download = "ma-bibliotheque-" + now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate()) + ".json";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  try { localStorage.setItem(LAST_EXPORT_KEY, now.toISOString()); } catch (e) {}
  renderExportNote();
  setStatus("exported");
});

/* Un fichier importé n'est jamais cru sur parole : on ne garde que les champs connus, avec leur type et une taille maximale */
const str = (v, max) => (v == null ? "" : String(v)).slice(0, max);
function cleanBook(b) {
  if (!b || typeof b !== "object" || !b.id) return null;
  return {
    id: str(b.id, 100), title: str(b.title, 300), author: str(b.author, 300), year: str(b.year, 10),
    cover: /^https:\/\//i.test(b.cover) ? str(b.cover, 1000) : "", isbn: str(b.isbn, 20), description: str(b.description, 6000),
    status: ["unread", "reading", "read"].includes(b.status) ? b.status : (b.read ? "read" : "unread"),
    owned: b.owned === true
  };
}
function parseImport(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.libs) || !data.libs.length) return null;
  const libs = data.libs.filter(l => l && typeof l === "object" && Array.isArray(l.books)).map(l => {
    const seen = new Set();
    const bks = l.books.map(cleanBook).filter(b => b && !seen.has(b.id) && seen.add(b.id));
    return { id: str(l.id, 60) || uid(), name: str(l.name, 40).trim() || t("defaultLibName"), books: bks };
  });
  return libs.length ? libs : null;
}

const nLibs = n => t(n === 1 ? "nLibs1" : "nLibsN", { n });
const nBooks = n => t(n === 1 ? "nBooks1" : "nBooksN", { n });
const isDemoLib = l => l.books.length > 0 && l.books.every(b => /^demo-/.test(b.id));
let pendingImport = null;

$("importBtn").addEventListener("click", () => { closeMenu(); $("importFile").value = ""; $("importFile").click(); });
$("importFile").addEventListener("change", async () => {
  const f = $("importFile").files[0];
  if (!f) return;
  try {
    if (f.size > MAX_IMPORT_BYTES) throw new Error("size");
    const libs = parseImport(JSON.parse(await f.text()));
    if (!libs) throw new Error("format");
    pendingImport = libs;
    $("importText").textContent = t("importText", { libs: nLibs(libs.length), books: nBooks(libs.reduce((n, l) => n + l.books.length, 0)) });
    $("importDemoNote").hidden = !state.libs.some(isDemoLib);
    $("importDlg").showModal();
  } catch (err) {
    setStatus("errImport", true);
  }
});

function finishImport(msgKey, params) {
  persist();
  resetLibSearch();
  $("resultsSection").hidden = true;
  $("importDlg").close();
  renderAll();
  setStatus(msgKey, false, params);
}

$("importMergeBtn").addEventListener("click", () => {
  if (!pendingImport) return;
  let added = 0, updated = 0;
  const keyOf = l => normText(l.name);
  /* La bibliothèque d'exemple intacte est retirée, sauf si le fichier doit s'y fusionner */
  state.libs = state.libs.filter(l => !isDemoLib(l) || pendingImport.some(il => il.id === l.id || keyOf(il) === keyOf(l)));
  pendingImport.forEach(il => {
    const lib = state.libs.find(l => l.id === il.id) || state.libs.find(l => keyOf(l) === keyOf(il));
    if (!lib) { state.libs.push({ id: il.id, name: il.name, books: il.books }); added += il.books.length; return; }
    il.books.forEach(b => {
      const i = lib.books.findIndex(x => x.id === b.id);
      if (i < 0) { lib.books.push(b); added++; return; }
      if (lib.books[i].status !== b.status || lib.books[i].owned !== b.owned) updated++;
      lib.books[i] = b;
    });
  });
  if (!state.currentId || !currentLib()) state.currentId = state.libs[0].id;
  finishImport("importDoneMerge", { added, updated });
});

$("importReplaceBtn").addEventListener("click", () => {
  if (!pendingImport) return;
  state.libs = pendingImport;
  if (!currentLib()) state.currentId = state.libs[0].id;
  finishImport("importDoneReplace", { libs: nLibs(state.libs.length), books: nBooks(state.libs.reduce((n, l) => n + l.books.length, 0)) });
});
$("importCancel").addEventListener("click", () => $("importDlg").close());
$("importDlg").addEventListener("close", () => { pendingImport = null; });
$("importDlg").addEventListener("click", e => { if (e.target === $("importDlg")) $("importDlg").close(); });

/* ---------- Langue de l'interface (FR / EN) ---------- */
document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => I18N.setLang(b.dataset.lang)));
I18N.onChange(() => {
  setStatus(statusState.key, statusState.isErr, statusState.params);
  if (!$("resultsSection").hidden) showResults(lastFound);
  renderAll();
});

I18N.applyStatic();
renderAll();
