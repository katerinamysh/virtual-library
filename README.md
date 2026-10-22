# Ma bibliothèque

Application web de bibliothèque virtuelle : on cherche un livre, on l'ajoute, puis on suit son état de lecture (non lu, en cours, lu) et s'il est possédé ou non. Plusieurs bibliothèques peuvent coexister.

**Démo** : <https://katerinamysh.github.io/virtual-library/>

![Page d'accueil](docs/apercu-accueil.png)

## Fonctionnalités

- **Recherche** par titre, auteur ou ISBN avec l'API [Google Books](https://developers.google.com/books), avec plusieurs tentatives automatiques si le service est momentanément indisponible.
- **Couvertures** : Open Library par ISBN en priorité, puis Google Books, puis le titre sur fond neutre.
- **Fiche d'un livre** : couverture, titre, auteur, année et descriptif à la demande.
- **Suivi de lecture** en deux temps : non lu, en cours ou lu, puis possédé ou non possédé.
- **Filtres** : tous, en cours, lus, non lus, possédés, non possédés. Un second clic sur le filtre actif revient à « Tous ».
- **Plusieurs bibliothèques** : création, renommage et suppression, avec un menu accessible au clavier (flèches, Échap).
- **Sauvegarde locale** dans le navigateur (`localStorage`) : aucune donnée n'est envoyée à un serveur.

![Fiche d'un livre](docs/apercu-fiche.png)

## Choix techniques

- **HTML, CSS et JavaScript sans framework ni étape de compilation.** Le site est un ensemble de fichiers statiques.
- **Mise en page par grille CSS** : jusqu'à 6 livres par ligne, titres, auteurs et pastilles alignés d'une carte à l'autre grâce à `subgrid`, avec un gabarit de repli et des points de suspension pour les textes longs.
- **Accessibilité** : navigation au clavier, rôles ARIA du menu, états `aria-pressed`, respect de `prefers-reduced-motion`.
- **Polices hébergées dans le site** (Playfair Display, Lora et Jost, sous licence SIL Open Font) : aucune requête vers un service de polices tiers.
- **Données de démonstration** : à la première visite, une bibliothèque d'exemple s'affiche (`demo.js`).

## Lancer le projet

Aucune installation n'est nécessaire. Ouvrez `index.html` dans un navigateur, ou lancez un serveur local :

```bash
python3 -m http.server 8000
```

puis ouvrez <http://localhost:8000>.

## Clé API Google Books (facultative)

La recherche fonctionne sans clé, mais Google peut limiter les requêtes anonymes. Pour utiliser une clé, renseignez-la dans `config.js` :

```js
window.APP_CONFIG = {
  googleBooksApiKey: "VOTRE_CLE"
};
```

Sur un site public, une clé est visible par tous les visiteurs. Utilisez une clé dédiée, restreinte à l'adresse du site (restriction « Websites ») et à l'API Books, avec un quota quotidien. Ne publiez jamais une clé non restreinte.

## Structure

```
index.html      page et fenêtres
style.css       styles et polices
script.js       logique de l'application
demo.js         bibliothèque d'exemple
config.js       configuration (clé API facultative)
fonts/          polices hébergées et leurs licences
docs/           captures d'écran du README
```

## Licence

Code publié sous licence [MIT](LICENSE). Les polices du dossier `fonts/` sont sous licence SIL Open Font (voir les fichiers `LICENSE-*.txt`).

## Limites connues

- Les données sont liées au navigateur : changer de navigateur ou vider ses données efface la bibliothèque. Un export et un import de fichier sont une piste d'amélioration.
- La recherche dépend de la disponibilité de l'API Google Books, qui répond parfois par une erreur 503.
