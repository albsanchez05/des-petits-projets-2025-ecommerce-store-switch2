// --- BLOC 1 : VARIABLES GLOBALES ET DÉMARRAGE ---
let cartButton;
let productGrid;
let categoryTitle;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Capturer les éléments
    cartButton = document.getElementById('cart-link-button');
    productGrid = document.getElementById('product-grid');
    categoryTitle = document.getElementById('category-title');

    // 2. Lire le paramètre 'name' de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');

    if (categoryName) {
        // 3. Mettre à jour le titre
        categoryTitle.textContent = `Catégorie : ${categoryName}`;

        // 4. Charger les produits filtrés
        loadCategoryProducts(categoryName);
    } else {
        // Erreur
        categoryTitle.textContent = 'Catégorie non trouvée';
        productGrid.innerHTML = '<p>Veuillez sélectionner une catégorie.</p>';
    }

    // 5. Mettre à jour le compteur du panier
    updateCartCount();
});

// --- BLOC 2 : CHARGER LES PRODUITS (API FILTRÉE) ---
async function loadCategoryProducts(categoryName) {
    try {
        const response = await fetch(`/api/products/byCategory/${categoryName}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const products = await response.json();

        productGrid.innerHTML = '';

        if (products.length === 0) {
             productGrid.innerHTML = '<p>Aucun produit trouvé dans cette catégorie.</p>';
             return;
        }

        // On réutilise la logique de "création de carte"
        products.forEach(product => {
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        productGrid.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    }
}

// --- BLOC 3 : USINE À CARTES (Copié de store.js) ---
// On a besoin de cette fonction ici
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}">
        <div class="product-info">
            <h3>${product.title}</h3>
        </div>
        <div class="product-footer">
            <span class="product-price">${product.price} €</span>
            <button class="add-to-cart-btn" data-product-id="${product.id}">
                Ajouter au panier
            </button>
        </div>
    `;
    const addToCartButton = card.querySelector('.add-to-cart-btn');
    addToCartButton.addEventListener('click', () => {
        addProductToCart(product.id);
    });
    return card;
}

// --- BLOC 4 : AJOUTER AU PANIER (Copié de store.js) ---
// On a besoin de cette fonction ici
async function addProductToCart(productId) {
    console.log(`Ajout du produit ID: ${productId} au panier...`);
    try {
        const response = await fetch(`/api/cart/add?productId=${productId}&quantity=1`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        console.log('Produit ajouté avec succès !');
        await updateCartCount();
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
    }
}

// --- BLOC 5 : METTRE À JOUR LE COMPTEUR (Copié de store.js) ---
// On a besoin de cette fonction ici
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