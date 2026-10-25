# My Library

*[Version française](README.fr.md)*

A virtual library web app: search for a book, add it, then track its reading status (unread, reading, read) and whether you own it. Several libraries can coexist.

**Live demo**: <https://katerinamysh.github.io/virtual-library/>

![Home page](docs/apercu-accueil.png)

## Features

- **Search** by title, author or ISBN with the [Google Books](https://developers.google.com/books) API, with up to 5 automatic retries (and a lighter request) when the service is temporarily unavailable.
- **Results in full rows**: 4 rows at a time, whatever the number of columns on screen, then a "Show more results" button. Only the last page, when there is nothing left to load, may end with an incomplete row.
- **Result language**: books in the interface language come first (for example French editions of a title when the interface is in French), followed by all the others: no language is excluded.
- **Covers**: Open Library by ISBN first, then Google Books, then the title on a neutral background.
- **Search within your library**: a second button, "My library", filters the books already added by title, author, year or ISBN (ignoring accents and case), combined with the reading filters.
- **Duplicate detection**: before adding a book, a dialog shows a similar book already in the library (same ISBN, or same title and a shared author, even for another edition) and asks for confirmation.
- **Book details**: cover, title, author, year and description on demand.
- **Reading tracking** in two steps: unread, reading or read, then owned or not owned.
- **Filters**: all, reading, read, unread, owned, not owned. Clicking the active filter again goes back to "All".
- **Genres**: the genre is assigned automatically (Google Books categories, then the genre of books by the same author, then keywords in the title and description) and can be changed in the book details; a manual choice is never overwritten. A dropdown filters the library by genre, with the number of books.
- **Books in progress**: always shown first, in a dark wooden frame, until they are read.
- **Multiple libraries**: create, rename and delete, with a keyboard-accessible menu (arrow keys, Esc).
- **French and English interface** (FR / EN buttons, browser language detected on the first visit). Search is not limited to any language: you can add books in any language, whatever the interface language.
- **Export and import**: from the logo menu, download all your libraries as a `.json` file (with the date of the last backup), then import it on another device, choosing to merge or replace. The imported file is validated and cleaned (known fields only, size limits, `https` covers only).
- **Local storage** in the browser (`localStorage`): no data is sent to a server.

![Book details](docs/apercu-fiche.png)

## Technical choices

- **Vanilla HTML, CSS and JavaScript, no framework and no build step.** The site is a set of static files.
- **Built with the help of an AI assistant** (Claude): I defined the features and interface choices, then reviewed and tested each version.
- **CSS Grid layout**: up to 6 books per row, with titles, authors and badges aligned across cards thanks to `subgrid`, a fallback template and ellipses for long text.
- **Custom dropdowns** (genres): background, hovered row and scrollbar in the site's colours, with keyboard navigation (arrow keys, Home/End, Enter, Esc, type-ahead). The native `<select>` stays behind the scenes as the source of truth.
- **Accessibility**: keyboard navigation, ARIA menu roles, `aria-pressed` states, `prefers-reduced-motion` support.
- **Self-hosted fonts** (Playfair Display, Lora and Jost, under the SIL Open Font License): no requests to a third-party font service.
- **Demo data**: on the first visit, a sample library is displayed (`demo.js`): French classics in French, English classics in English. Their covers are loaded by ISBN from Open Library.

## Running the project

No installation needed. Open `index.html` in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000>.

## Google Books API key (optional)

Search works without a key, but Google may limit anonymous requests. To use a key, set it in `config.js`:

```js
window.APP_CONFIG = {
  googleBooksApiKey: "YOUR_KEY"
};
```

On a public site, the key is visible to every visitor. Use a dedicated key, restricted to the site's domain ("Websites" restriction, for example `https://your-account.github.io/*`, since the browser only sends the domain) and to the Books API, with a daily quota. Never publish an unrestricted key.

## Structure

```
index.html      page and dialogs
style.css       styles and fonts
script.js       application logic
demo.js         sample library (FR / EN)
i18n.js         interface translations
config.js       configuration (optional API key)
fonts/          self-hosted fonts and their licences
docs/           README screenshots and link preview image
```

## Author

Katerina Myshkin · [LinkedIn](https://www.linkedin.com/in/katerina-myshkin) · [GitHub](https://github.com/katerinamysh)

## Licence

Code released under the [MIT](LICENSE) licence. The fonts in the `fonts/` folder are under the SIL Open Font License (see the `LICENSE-*.txt` files). The `separateur.webp` image was created with Canva and is not covered by the MIT licence.

## Known limitations

- Data is tied to the browser: switching browsers or clearing site data erases the library. Export and import let you transfer or back it up, without automatic sync.
- Search depends on the availability of the Google Books API, which sometimes responds with a 503 error.
