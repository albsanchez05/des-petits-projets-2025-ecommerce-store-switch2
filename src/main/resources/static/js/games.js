// 'DOMContentLoaded' s'exécute quand 'games.html' est prêt
document.addEventListener('DOMContentLoaded', () => {

    // 1. Capturer le conteneur de la grille
    const categoryGrid = document.getElementById('category-grid');

    // 2. Lancer la fonction pour charger les catégories de jeux
    loadGameCategories(categoryGrid);

    // 3. Mettre à jour le compteur du panier
    // Cet appel fonctionne car on a aussi chargé store.js
    updateCartCount();
});

/**
 * Appelle l'API pour charger les catégories de jeux
 */
async function loadGameCategories(categoryGrid) {
    try {
        // 1. On appelle notre NOUVELLE API (testée avec Hoppscotch)
        const response = await fetch('/api/categories/search?prefix=Jeux');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const categories = await response.json(); // La liste de nos 7 catégories de jeux

        categoryGrid.innerHTML = ''; // On vide la grille

        if (categories.length === 0) {
             categoryGrid.innerHTML = '<p>Aucune catégorie de jeu trouvée.</p>';
             return;
        }

        // 2. On boucle sur chaque catégorie de jeu reçue
        categories.forEach(category => {
            // 3. On crée une "carte" pour cette catégorie
            const categoryCard = createCategoryCard(category);
            categoryGrid.appendChild(categoryCard);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        categoryGrid.innerHTML = '<p>Erreur lors du chargement des catégories.</p>';
    }
}

/**
 * Crée le HTML pour une seule carte "Catégorie".
 * @param {object} category - L'objet catégorie reçu de l'API
 * @returns {HTMLElement} L'élément <a> (lien)
 */
function createCategoryCard(category) {
    const cardLink = document.createElement('a');
    cardLink.className = 'product-card';
    cardLink.href = `category.html?name=${encodeURIComponent(category.name)}`;

    // --- C'EST LA NOUVELLE PARTIE ---

    // 1. On génère une couleur unique depuis le nom
    const categoryColor = generateColorFromString(category.name);

    // 2. On crée le HTML avec la nouvelle "ligne de couleur"
    cardLink.innerHTML = `
        <div class="category-color-bar" style="background-color: ${categoryColor};"></div>

        <div class="product-info category-card-info">
            <h3>${category.name}</h3>
        </div>
    `;
    // --- FIN DE LA NOUVELLE PARTIE ---

    return cardLink;
}

/**
 * Génère une couleur unique (mais constante) basée sur un string.
 * @param {string} str - Le nom de la catégorie
 * @returns {string} Un code couleur hexadécimal (ex: #f0a3b2)
 */
function generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        // On s'assure que la couleur n'est pas trop claire (on la fonce un peu)
        const limitedValue = Math.max(value, 60) - 60;
        color += ('00' + limitedValue.toString(16)).substr(-2);
    }
    return color;
}