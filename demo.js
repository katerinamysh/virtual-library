/* Bibliothèques d'exemple affichées à la première visite, dans la langue de l'interface :
   classiques français pour le français, classiques anglais pour l'anglais.
   Les couvertures sont chargées par ISBN depuis Open Library, comme pour tous les livres (voir coverEl dans script.js) ;
   si une couverture manque, le titre s'affiche à sa place. Descriptifs rédigés pour la démonstration. */
window.DEMO_LIBRARY = {
  fr: {
    name: "Bibliothèque d'exemple",
    books: [
      { id: "demo-fr-1", title: "Madame Bovary", author: "Gustave Flaubert", year: "1857", isbn: "9782070413119", status: "read", owned: true,
        description: "Emma Bovary, épouse d'un médecin de province, cherche dans les romans et les amours illusoires une vie plus intense que la sienne." },
      { id: "demo-fr-2", title: "Le Rouge et le Noir", author: "Stendhal", year: "1830", isbn: "9782070360178", status: "reading", owned: true,
        description: "Fils de charpentier, Julien Sorel veut s'élever dans une société qui se partage entre l'armée et l'Église." },
      { id: "demo-fr-3", title: "Germinal", author: "Émile Zola", year: "1885", isbn: "9782266199285", status: "unread", owned: false,
        description: "Dans le nord de la France, une grève éclate parmi les mineurs et révèle la violence des rapports entre capital et travail." },
      { id: "demo-fr-4", title: "Les Fleurs du mal", author: "Charles Baudelaire", year: "1857", isbn: "9782266083263", status: "read", owned: true,
        description: "Recueil de poèmes qui explore la beauté, le spleen et la ville moderne, et dont la publication a fait scandale." },
      { id: "demo-fr-5", title: "Candide", author: "Voltaire", year: "1759", isbn: "9782070793709", status: "read", owned: false,
        description: "Un jeune homme naïf traverse le monde en apprenant, à ses dépens, que tout n'est pas pour le mieux." },
      { id: "demo-fr-6", title: "Le Horla", author: "Guy de Maupassant", year: "1887", isbn: "9782070458202", status: "unread", owned: true,
        description: "Un homme se croit hanté par un être invisible qui prend peu à peu possession de lui." },
      { id: "demo-fr-7", title: "Notre-Dame de Paris", author: "Victor Hugo", year: "1831", isbn: "9782070365494", status: "reading", owned: false,
        description: "Dans le Paris médiéval, la bohémienne Esmeralda attire le regard de trois hommes que tout oppose." },
      { id: "demo-fr-8", title: "L'Étranger", author: "Albert Camus", year: "1942", isbn: "9782070360024", status: "unread", owned: false,
        description: "À Alger, Meursault commet un meurtre, puis est jugé autant pour son indifférence que pour son geste." }
    ]
  },
  en: {
    name: "Sample library",
    books: [
      { id: "demo-en-1", title: "Pride and Prejudice", author: "Jane Austen", year: "1813", isbn: "9780141439518", status: "read", owned: true,
        description: "Elizabeth Bennet and the proud Mr Darcy must overcome their first impressions, and the social expectations of their time, before they can understand each other." },
      { id: "demo-en-2", title: "Jane Eyre", author: "Charlotte Brontë", year: "1847", isbn: "9780141441146", status: "reading", owned: true,
        description: "An orphan becomes a governess at Thornfield Hall, where her independence is tested by her feelings for its secretive master." },
      { id: "demo-en-3", title: "Frankenstein", author: "Mary Shelley", year: "1818", isbn: "9780141439471", status: "unread", owned: false,
        description: "A young scientist brings a creature to life, then abandons it, and both must face the consequences of that decision." },
      { id: "demo-en-4", title: "Dracula", author: "Bram Stoker", year: "1897", isbn: "9780141439846", status: "read", owned: true,
        description: "Told through letters and diaries, the story follows a group of friends who set out to stop a count who is coming to England." },
      { id: "demo-en-5", title: "Great Expectations", author: "Charles Dickens", year: "1861", isbn: "9780141439563", status: "read", owned: false,
        description: "Pip, a poor orphan, is given the chance to become a gentleman and slowly learns where his fortune really comes from." },
      { id: "demo-en-6", title: "Wuthering Heights", author: "Emily Brontë", year: "1847", isbn: "9780141439556", status: "unread", owned: true,
        description: "On the Yorkshire moors, the stormy bond between Heathcliff and Catherine Earnshaw shapes two generations of two families." },
      { id: "demo-en-7", title: "The Picture of Dorian Gray", author: "Oscar Wilde", year: "1890", isbn: "9780141439570", status: "reading", owned: false,
        description: "A young man stays beautiful while his portrait takes on the marks of his choices." },
      { id: "demo-en-8", title: "Moby-Dick", author: "Herman Melville", year: "1851", isbn: "9780142437247", status: "unread", owned: false,
        description: "Captain Ahab pursues the white whale across the seas, and the narrator Ishmael tells how the hunt consumes the whole crew." }
    ]
  }
};
