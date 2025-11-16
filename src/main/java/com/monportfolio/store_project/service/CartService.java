package com.monportfolio.store_project.service;

import com.monportfolio.store_project.entity.CartItem;
import com.monportfolio.store_project.entity.Product;
import com.monportfolio.store_project.repository.CartItemRepository;
import com.monportfolio.store_project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired; // Importe l'injection
import org.springframework.stereotype.Service; // Importe l'annotation Service

import java.util.List;
import java.util.Optional;

@Service
public class CartService
{
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Ajoute un produit au panier ou met à jour sa quantité.
     * @param productId L'ID du produit à ajouter.
     * @param quantity La quantité à ajouter.
     */

    public void addProductToCart(Long productId, int quantity)
    {

        // 1. Trouver le produit en BDD
        // On utilise .findById() qui renvoie un "Optional" (pour éviter les null)
        Product product = productRepository.findById( productId )
            .orElseThrow( () -> new RuntimeException( "Produit non trouvé avec l'id: " + productId ) );

        // 2. Vérifier si ce produit est DÉJÀ dans le panier
        Optional<CartItem> existingItemOptional = cartItemRepository.findByProduct( product );

        if ( existingItemOptional.isPresent() )
        {
            // 3. Si oui, mettre à jour la quantité
            CartItem existingItem = existingItemOptional.get();
            existingItem.setQuantity( existingItem.getQuantity() + quantity );
            cartItemRepository.save( existingItem );
            System.out.println( "Quantité mise à jour pour: " + product.getTitle() );
        }
        else
        {
            // 4. Si non, créer un nouveau CartItem
            CartItem newItem = new CartItem();
            newItem.setProduct( product );
            newItem.setQuantity( quantity );
            cartItemRepository.save( newItem );
            System.out.println( "Nouveau produit ajouté au panier: " + product.getTitle() );
        }

    }

    /**
     * Une méthode pour VOIR le panier
     */
    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    /**
     * Vide complètement le panier en supprimant tous les articles.
     */
    public void clearCart() {
        cartItemRepository.deleteAll();
    }




}
