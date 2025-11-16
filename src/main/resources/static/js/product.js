// --- BLOC 1 : VARIABLES GLOBALES ET DÉMARRAGE ---
let cartButton;
let detailContainer;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Capturer les éléments
    cartButton = document.getElementById('cart-link-button');
    detailContainer = document.getElementById('product-detail-container');

    // 2. Lire le paramètre 'id' de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // 3. Charger les détails du produit
        loadProductDetails(productId);
    } else {
        // Erreur
        detailContainer.innerHTML = '<p>Produit non trouvé. <a href="index.html">Retour à l\'accueil</a></p>';
    }

    // 4. Mettre à jour le compteur du panier
    updateCartCount();
});

// --- BLOC 2 : CHARGER LES DÉTAILS DU PRODUIT (API) ---
async function loadProductDetails(productId) {
    try {
        // On appelle notre endpoint (testé avec Hoppscotch)
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const product = await response.json(); // On reçoit UN objet

        // On "dessine" la page de détails
        detailContainer.innerHTML = `
            <div class="product-detail-layout">
                <div class="product-detail-image">
                    <img src="${product.imageUrl}" alt="${product.title}">
                </div>

                <div class="product-detail-info">
                    <h2>${product.title}</h2>
                    <span class="product-price">${product.price} €</span>
                    <div class="product-ratings">
                        <span>⭐ ${product.stars} (${product.reviews} avis)</span>
                    </div>
                    <p class="product-long-description">
                        ${product.description}
                    </p>

                    <button class="add-to-cart-btn" id="detail-add-btn">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `;

        // On attache l'écouteur au bouton qu'on vient de créer
        document.getElementById('detail-add-btn').addEventListener('click', () => {
            addProductToCart(product.id);
        });

    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        detailContainer.innerHTML = '<p>Erreur lors du chargement du produit.</p>';
    }
}

// --- BLOC 3 : AJOUTER AU PANIER (Copié de store.js) ---
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

// --- BLOC 4 : METTRE À JOUR LE COMPTEUR (Copié de store.js) ---
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