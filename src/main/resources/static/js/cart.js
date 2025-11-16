// --- BLOC 1 : VARIABLES GLOBALES ET DÉMARRAGE ---

// On déclare nos variables globales pour cette page
let cartContainer;
let cartTotalElement;

// 'DOMContentLoaded' s'exécute quand le HTML 'cart.html' est prêt.
document.addEventListener('DOMContentLoaded', () => {

    // 1. On ASSIGNE les variables
    cartContainer = document.getElementById('cart-container');
    cartTotalElement = document.getElementById('cart-total');

    const placeOrderBtn = document.getElementById('place-order-btn');
    const cancelOrderBtn = document.getElementById('cancel-order-btn');

    // 2. On lance la fonction principale pour charger le panier
    loadCartItems();

    placeOrderBtn.addEventListener('click', placeOrder);
    cancelOrderBtn.addEventListener('click', cancelOrder);
});

// --- BLOC 2 : CHARGER ET AFFICHER LE PANIER (GET /api/cart) ---

/**
 * Fonction principale pour charger le contenu du panier depuis l'API.
 */
async function loadCartItems() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cartItems = await response.json();

        if (cartItems.length === 0) {
            cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
            cartTotalElement.textContent = '0.00 €';
            return;
        }

        // Si le panier n'est pas vide :
        renderCartTable(cartItems); // Dessine le tableau
        calculateCartTotal(cartItems); // Calcule le total
        attachQuantityListeners(); // Attache les écouteurs aux <input>

    } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        cartContainer.innerHTML = '<p>Erreur lors du chargement du panier.</p>';
    }
}

// --- BLOC 3 : DESSINER LE TABLEAU DU PANIER ---

/**
 * "Dessine" le tableau HTML des articles du panier.
 */
function renderCartTable(cartItems) {

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Total Ligne</th>
                </tr>
            </thead>
            <tbody>
    `;

    cartItems.forEach(item => {
        const lineTotal = parseFloat(item.product.price) * item.quantity;

        tableHTML += `
            <tr>
                <td>
                    <img src="${item.product.imageUrl}" alt="${item.product.title}" class="cart-item-image">
                    <span>${item.product.title}</span>
                </td>
                <td>
                    ${item.product.price} €
                </td>
                <td>
                    <input
                        type="number"
                        class="quantity-input"
                        value="${item.quantity}"
                        min="1"
                        data-item-id="${item.id}"
                    >
                </td>
                <td>
                    ${lineTotal.toFixed(2)} €
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    cartContainer.innerHTML = tableHTML;
}

// --- BLOC 4 : CALCULER LE TOTAL DU PANIER ---

/**
 * Calcule le prix total du panier et l'affiche.
 */
function calculateCartTotal(cartItems) {
    let grandTotal = 0;
    cartItems.forEach(item => {
        const price = parseFloat(item.product.price);
        const lineTotal = price * item.quantity;
        grandTotal += lineTotal;
    });

    cartTotalElement.textContent = `${grandTotal.toFixed(2)} €`;
}

// --- BLOC 5 : LOGIQUE DE MISE À JOUR DES QUANTITÉS ---

/**
 * Trouve tous les champs <input> et leur attache un écouteur.
 */
function attachQuantityListeners() {
    // 1. Trouver TOUS les champs <input>
    const quantityInputs = document.querySelectorAll('.quantity-input');

    // 2. Boucler sur chacun et attacher un écouteur
    quantityInputs.forEach(input => {
        // L'événement 'change' se déclenche quand on quitte le champ
        input.addEventListener('change', (event) => {
            const newQuantity = event.target.value;
            const cartItemId = event.target.dataset.itemId;

            // On appelle la fonction (Bloc 6) pour mettre à jour le backend
            updateCartQuantity(cartItemId, newQuantity);
        });
    });
}

/**
 * Appelle l'API backend pour mettre à jour la quantité.
 * @param {number} cartItemId - L'ID de l'article (ex: 1)
 * @param {number} quantity - La nouvelle quantité (ex: 3)
 */
async function updateCartQuantity(cartItemId, quantity) {
    console.log(`Mise à jour Item ${cartItemId} -> Quantité ${quantity}`);

    // On vérifie que la quantité est valide
    if (quantity < 1) {
        console.log('Quantité invalide, rechargement...');
        loadCartItems(); // Recharge le panier pour annuler
        return;
    }

    try {
        // 1. Appeler notre nouvel endpoint POST /api/cart/update
        const response = await fetch(`/api/cart/update?cartItemId=${cartItemId}&quantity=${quantity}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }

        // 2. Si la BDD est à jour, on recharge tout le panier
        // C'est la façon la plus simple de garantir que le total est correct
        console.log('Mise à jour BDD réussie. Rechargement du panier...');
        loadCartItems();

    } catch (error) {
        console.error('Erreur "Update Quantity":', error);
    }
}

// --- BLOC 6 : PASSER ET ANNULER LA COMMANDE ---

/**
 * Simule une commande "réussie" en vidant le panier.
 */
async function placeOrder() {
    console.log('Commande passée !');
    try {
        // 1. On appelle notre nouvel endpoint DELETE
        const response = await fetch('/api/cart', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la validation de la commande');
        }

        // 2. Si c'est réussi, on affiche une confirmation
        cartContainer.innerHTML = '<h2>Merci pour votre commande !</h2><p>Votre numéro de confirmation est : <strong>' + Date.now() + '</strong></p>';
        cartTotalElement.textContent = '0.00 €';

        // On met à jour le compteur sur la page principale (même si on n'est pas dessus)
        // On le fait juste au cas où, c'est une bonne pratique
        // (Cette fonction n'existe que dans store.js, donc on va la copier)
        // Pour l'instant, on va juste recharger le panier vide :
        // loadCartItems(); // Non, on affiche un message custom

    } catch (error) {
        console.error('Erreur "Place Order":', error);
    }
}

/**
 * Annule la commande en vidant le panier.
 */
async function cancelOrder() {
    console.log('Commande annulée');
    try {
        // 1. On appelle le MÊME endpoint DELETE
        const response = await fetch('/api/cart', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'annulation');
        }

        // 2. On recharge le panier (qui sera maintenant vide)
        loadCartItems();

    } catch (error) {
        console.error('Erreur "Cancel Order":', error);
    }
}