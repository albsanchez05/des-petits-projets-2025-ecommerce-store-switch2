package com.monportfolio.store_project.controller;

import com.monportfolio.store_project.entity.CartItem;
import com.monportfolio.store_project.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController
{
    @Autowired
    private CartService cartService;

    @GetMapping
    public List<CartItem> getCartContents()
    {
        return cartService.getCartItems();
    }

    @PostMapping("/add")
    public void addToCart(@RequestParam Long productId, @RequestParam int quantity) {
        cartService.addProductToCart( productId, quantity );
    }

    /**
     * Vide l'intégralité du panier.
     * Répond à DELETE /api/cart
     */
    @DeleteMapping
    public void clearCart() {
        cartService.clearCart();
    }



}
