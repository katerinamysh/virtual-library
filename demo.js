/* Bibliothèque d'exemple affichée à la première visite (aucun appel réseau).
   Titres du domaine public ; descriptifs rédigés pour la démonstration. */
window.DEMO_LIBRARY = {
  name: "Bibliothèque d'exemple",
  books: [
    { id: "demo-1", title: "Madame Bovary", author: "Gustave Flaubert", year: "1857", status: "read", owned: true,
      description: "Emma Bovary, épouse d'un médecin de province, cherche dans les romans et les amours illusoires une vie plus intense que la sienne." },
    { id: "demo-2", title: "Le Rouge et le Noir", author: "Stendhal", year: "1830", status: "reading", owned: true,
      description: "Fils de charpentier, Julien Sorel veut s'élever dans une société qui se partage entre l'armée et l'Église." },
    { id: "demo-3", title: "Germinal", author: "Émile Zola", year: "1885", status: "unread", owned: false,
      description: "Dans le nord de la France, une grève éclate parmi les mineurs et révèle la violence des rapports entre capital et travail." },
    { id: "demo-4", title: "Les Fleurs du mal", author: "Charles Baudelaire", year: "1857", status: "read", owned: true,
      description: "Recueil de poèmes qui explore la beauté, le spleen et la ville moderne, et dont la publication a fait scandale." },
    { id: "demo-5", title: "Candide", author: "Voltaire", year: "1759", status: "read", owned: false,
      description: "Un jeune homme naïf traverse le monde en apprenant, à ses dépens, que tout n'est pas pour le mieux." },
    { id: "demo-6", title: "Le Horla", author: "Guy de Maupassant", year: "1887", status: "unread", owned: true,
      description: "Un homme se croit hanté par un être invisible qui prend peu à peu possession de lui." },
    { id: "demo-7", title: "Notre-Dame de Paris", author: "Victor Hugo", year: "1831", status: "reading", owned: false,
      description: "Dans le Paris médiéval, la bohémienne Esmeralda attire le regard de trois hommes que tout oppose." },
    { id: "demo-8", title: "L'Étranger", author: "Albert Camus", year: "1942", status: "unread", owned: false,
      description: "À Alger, Meursault commet un meurtre, puis est jugé autant pour son indifférence que pour son geste." }
  ]
};
