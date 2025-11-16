package com.monportfolio.store_project.controller;

import com.monportfolio.store_project.entity.Product;
import com.monportfolio.store_project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController
{
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllRecords() {
        return productService.getAllProducts();
    }

    /**
     * Renvoie tous les produits d'une catégorie spécifique.
     * Répond à GET /api/products/byCategory/Consoles
     */
    @GetMapping("/byCategory/{categoryName}")
    public List<Product> getProductsByCategory(@PathVariable String categoryName) {
        return productService.getProductsByCategoryName(categoryName);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

}
