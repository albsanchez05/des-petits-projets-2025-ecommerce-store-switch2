// --- BLOC 1 : VARIABLES GLOBALES ---
// On les déclare ici (avec 'let') pour que toutes les fonctions les voient
let cartButton;
let productGrid;

// --- BLOC 2 : DÉMARRAGE DE L'APPLICATION ---
// 'DOMContentLoaded' s'exécute quand le HTML 'index.html' est prêt.
document.addEventListener('DOMContentLoaded', () => {

    // 1. On ASSIGNE nos variables globales
        cartButton = document.getElementById('cart-link-button');
        productGrid = document.getElementById('product-grid'); // Sera 'null' sur product.html

        // 2. On lance les actions de démarrage

        // --- C'EST LA CORRECTION ---
        // On ne charge les produits QUE SI la grille existe
        // (c-à-d, si on est sur index.html)
        if (productGrid) {
            loadAllProducts();
        }

    updateCartCount(); // Met à jour le "Panier (0)"

});

// --- BLOC 3 : CHARGER LES PRODUITS (GET /api/products) ---

/**
 * Appelle l'API GET /api/products et affiche chaque produit.
 */
async function loadAllProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const products = await response.json();

        productGrid.innerHTML = ''; // On vide la grille

        // On boucle sur les produits et on crée une carte pour chacun
        products.forEach(product => {
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        productGrid.innerHTML = '<p>Erreur lors du chargement des produits. Le serveur est-il lancé ?</p>';
    }
}

/**
 * Crée le HTML pour une seule carte produit.
 * @param {object} product - L'objet produit reçu de l'API
 * @returns {HTMLElement} La <div> de la carte
 */
function createProductCard(product) {
    // 1. On crée l'élément parent de la carte
    const card = document.createElement('div');
    card.className = 'product-card'; // On lui donne la classe CSS

    // 2. On crée le lien (ex: product.html?id=2)
    const productLink = `product.html?id=${product.id}`;

    // 3. On remplit la carte avec le HTML (VERSION CORRIGÉE)
    card.innerHTML = `
        <a href="${productLink}" class="product-image-link">
            <img src="${product.imageUrl}" alt="${product.title}">
        </a>
        <div class="product-info">
            <a href="${productLink}" class="product-title-link">
                <h3>${product.title}</h3>
            </a>
        </div>

        <div class="product-footer">
            <span class="product-price">${product.price} €</span>
            <button class="add-to-cart-btn" data-product-id="${product.id}">
                Ajouter au panier
            </button>
        </div>
        `;

    // 4. Maintenant, ce 'querySelector' VA TROUVER le bouton
    const addToCartButton = card.querySelector('.add-to-cart-btn');

    // 5. On attache l'écouteur de clic
    addToCartButton.addEventListener('click', () => {
        addProductToCart(product.id);
    });

    // 6. On retourne la carte complétée
    return card;
}
// --- BLOC 4 : AJOUTER AU PANIER (POST /api/cart/add) ---

/**
 * Appelle l'API backend pour ajouter un produit au panier.
 * @param {number} productId - L'ID du produit (ex: 2)
 */
async function addProductToCart(productId) {
    console.log(`Ajout du produit ID: ${productId} au panier...`);

    try {
        // 1. On appelle notre API POST
        const response = await fetch(`/api/cart/add?productId=${productId}&quantity=1`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // 2. Si l'ajout a réussi, on met à jour le compteur
        console.log('Produit ajouté avec succès !');
        await updateCartCount(); // On rafraîchit le "Panier (X)"

    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
    }
}

// --- BLOC 5 : METTRE À JOUR LE COMPTEUR (GET /api/cart) ---

/**
 * Appelle l'API GET /api/cart pour savoir combien d'items
 * il y a dans le panier et met à jour le bouton.
 */
async function updateCartCount() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const cartItems = await response.json();

        let totalItems = 0;
        cartItems.forEach(item => {
            totalItems += item.quantity;
        });

        // CORRECTION CLÉ : 'cartButton' est maintenant visible
        // On vérifie qu'il n'est pas 'null' (au cas où)
        if (cartButton) {
            cartButton.textContent = `Panier (${totalItems})`;
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur:', error);
        if (cartButton) {
            cartButton.textContent = 'Panier (?)';
        }
    }
}