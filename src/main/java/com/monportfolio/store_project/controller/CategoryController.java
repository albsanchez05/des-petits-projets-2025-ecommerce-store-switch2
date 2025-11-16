package com.monportfolio.store_project.controller;

import com.monportfolio.store_project.entity.Category;
import com.monportfolio.store_project.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * Endpoint pour rechercher des catégories par préfixe.
     * Répond à: GET /api/categories/search?prefix=Jeux
     */
    @GetMapping("/search")
    public List<Category> searchCategories( @RequestParam String prefix) {
        return categoryService.findCategoriesByPrefix(prefix);
    }
}