/* Traductions de l'interface (français / English).
   Pour ajouter une langue : copier un bloc de DICT, traduire les valeurs, puis ajouter un bouton dans index.html.
   Les livres, eux, ne sont jamais traduits : la recherche Google Books n'est limitée à aucune langue. */
(function () {
  const STORE_LANG = "ma-bibliotheque-lang";

  const DICT = {
    fr: {
      pageTitle: "Ma bibliothèque · bibliothèque virtuelle",
      metaDesc: "Bibliothèque virtuelle : recherche de livres avec l'API Google Books, suivi de lecture (lu, en cours, non lu), livres possédés ou non, et plusieurs bibliothèques.",
      ogDesc: "Suivez vos lectures : recherche Google Books, statuts de lecture, livres possédés, plusieurs bibliothèques.",
      ogTitle: "Ma bibliothèque",
      langGroup: "Langue de l'interface",
      title: "Bibliothèque",
      myLibraries: "Mes bibliothèques",
      goLibrary: "Aller à ma bibliothèque",
      noLibrary: "Aucune bibliothèque",
      noLibraryYet: "Aucune bibliothèque pour le moment.",
      newLibrary: "+ Créer une nouvelle bibliothèque",
      defaultLibName: "Ma bibliothèque",
      rename: "Renommer",
      remove: "Supprimer",
      searchPlaceholder: "Titre, auteur ou ISBN",
      searchLabel: "Rechercher un livre",
      searchBtn: "Rechercher",
      searching: "Recherche en cours…",
      searchInLib: "Dans « {name} »",
      searchInLibLabel: "Rechercher dans la bibliothèque « {name} »",
      libFound1: "1 livre trouvé dans « {name} ».",
      libFoundN: "{n} livres trouvés dans « {name} ».",
      libNone: "Aucun livre de « {name} » ne correspond à cette recherche.",
      emptySearch: "Aucun livre ne correspond à cette recherche dans la bibliothèque.",
      noResults: "Aucun résultat. Essayez un autre titre ou un nom d'auteur.",
      errLimit: "Limite de requêtes Google atteinte ou clé refusée (erreur {code}). Réessayez dans un moment.",
      errHttp: "Google Books a répondu par une erreur {code}. Réessayez.",
      errNetwork: "Requête bloquée ou pas de connexion. Ouvrez la page directement dans votre navigateur et vérifiez votre connexion.",
      results: "Résultats",
      showMore: "Afficher plus de résultats",
      noMore: "Il n'y a plus d'autres résultats.",
      close: "Fermer",
      fAll: "Tous",
      fReading: "En cours",
      fRead: "Lus",
      fUnread: "Non lus",
      fOwned: "Possédés",
      fNotOwned: "Non possédés",
      stUnread: "Non lu",
      stReading: "En cours",
      stRead: "Lu",
      owned: "Possédé",
      notOwned: "Non possédé",
      emptyNoLib: "Créez une bibliothèque pour commencer.",
      emptyFilter: "Aucun livre dans cette catégorie.",
      emptyLib: "Cette bibliothèque est vide. Recherchez un livre pour l'ajouter.",
      untitled: "Sans titre",
      unknownAuthor: "Auteur inconnu",
      coverOf: "Couverture de {title}",
      openSheet: "Ouvrir la fiche : {title}",
      showDesc: "Voir le descriptif",
      hideDesc: "Masquer le descriptif",
      noDesc: "Aucun descriptif disponible pour ce livre.",
      thisBookIs: "Ce livre est…",
      ownership: "Possession du livre",
      removeBook: "Retirer",
      save: "Enregistrer",
      createLibTitle: "Créer une nouvelle bibliothèque",
      renameLibTitle: "Renommer la bibliothèque",
      libName: "Nom de la bibliothèque",
      libPlaceholder: "Ex. : Bibliothèque de Marie",
      cancel: "Annuler",
      create: "Créer",
      deleteLibTitle: "Supprimer la bibliothèque",
      deleteText1: "Supprimer « {name} » et le livre qu'elle contient ? Cette action est irréversible.",
      deleteTextN: "Supprimer « {name} » et les {n} livres qu'elle contient ? Cette action est irréversible.",
      deleteTextEmpty: "Supprimer « {name} » ? Cette action est irréversible.",
      deleteConfirm: "Supprimer",
      dupTitle: "Un livre similaire a déjà été ajouté",
      dupText: "Voici le livre déjà présent dans « {name} » :",
      dupAsk: "Voulez-vous quand même ajouter celui que vous venez de choisir ?",
      dupAdd: "Ajouter quand même"
    },
    en: {
      pageTitle: "My library · virtual library",
      metaDesc: "Virtual library: search books with the Google Books API, track your reading (read, reading, unread), mark books as owned or not, and keep several libraries.",
      ogDesc: "Track your reading: Google Books search, reading status, owned books, several libraries.",
      ogTitle: "My library",
      langGroup: "Interface language",
      title: "Library",
      myLibraries: "My libraries",
      goLibrary: "Go to my library",
      noLibrary: "No library",
      noLibraryYet: "No library yet.",
      newLibrary: "+ Create a new library",
      defaultLibName: "My library",
      rename: "Rename",
      remove: "Delete",
      searchPlaceholder: "Title, author or ISBN",
      searchLabel: "Search for a book",
      searchBtn: "Search",
      searching: "Searching…",
      searchInLib: "In “{name}”",
      searchInLibLabel: "Search in the library “{name}”",
      libFound1: "1 book found in “{name}”.",
      libFoundN: "{n} books found in “{name}”.",
      libNone: "No book in “{name}” matches this search.",
      emptySearch: "No book in the library matches this search.",
      noResults: "No results. Try another title or an author's name.",
      errLimit: "Google request limit reached or key refused (error {code}). Please try again in a moment.",
      errHttp: "Google Books replied with an error {code}. Please try again.",
      errNetwork: "Request blocked or no connection. Open the page directly in your browser and check your connection.",
      results: "Results",
      showMore: "Show more results",
      noMore: "There are no more results.",
      close: "Close",
      fAll: "All",
      fReading: "Reading",
      fRead: "Read",
      fUnread: "Unread",
      fOwned: "Owned",
      fNotOwned: "Not owned",
      stUnread: "Unread",
      stReading: "Reading",
      stRead: "Read",
      owned: "Owned",
      notOwned: "Not owned",
      emptyNoLib: "Create a library to get started.",
      emptyFilter: "No books in this category.",
      emptyLib: "This library is empty. Search for a book to add it.",
      untitled: "Untitled",
      unknownAuthor: "Unknown author",
      coverOf: "Cover of {title}",
      openSheet: "Open book details: {title}",
      showDesc: "Show description",
      hideDesc: "Hide description",
      noDesc: "No description available for this book.",
      thisBookIs: "This book is…",
      ownership: "Book ownership",
      removeBook: "Remove",
      save: "Save",
      createLibTitle: "Create a new library",
      renameLibTitle: "Rename the library",
      libName: "Library name",
      libPlaceholder: "E.g. Marie's library",
      cancel: "Cancel",
      create: "Create",
      deleteLibTitle: "Delete the library",
      deleteText1: "Delete “{name}” and the book it contains? This cannot be undone.",
      deleteTextN: "Delete “{name}” and the {n} books it contains? This cannot be undone.",
      deleteTextEmpty: "Delete “{name}”? This cannot be undone.",
      deleteConfirm: "Delete",
      dupTitle: "A similar book has already been added",
      dupText: "Here is the book already in “{name}”:",
      dupAsk: "Do you still want to add the one you just picked?",
      dupAdd: "Add anyway"
    }
  };

  let lang = "fr";
  try {
    const saved = localStorage.getItem(STORE_LANG);
    if (saved && DICT[saved]) lang = saved;
    else lang = /^fr/i.test(navigator.language || "") ? "fr" : "en";
  } catch (e) {
    lang = /^fr/i.test(navigator.language || "") ? "fr" : "en";
  }

  const listeners = [];

  function t(key, params) {
    let s = (DICT[lang] && DICT[lang][key]);
    if (s === undefined) s = DICT.fr[key];
    if (s === undefined) return key;
    return params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m)) : s;
  }

  /* Textes fixes de la page : data-i18n (texte) et data-i18n-<attribut> (placeholder, aria-label, title, content) */
  const ATTRS = ["placeholder", "aria-label", "title", "content"];
  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = t("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    ATTRS.forEach(a => {
      document.querySelectorAll("[data-i18n-" + a + "]").forEach(el => {
        el.setAttribute(a, t(el.getAttribute("data-i18n-" + a)));
      });
    });
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  }

  function setLang(l) {
    if (!DICT[l] || l === lang) return;
    lang = l;
    try { localStorage.setItem(STORE_LANG, l); } catch (e) {}
    applyStatic();
    listeners.forEach(f => f());
  }

  window.I18N = { t, applyStatic, setLang, getLang: () => lang, onChange: f => listeners.push(f) };
})();
