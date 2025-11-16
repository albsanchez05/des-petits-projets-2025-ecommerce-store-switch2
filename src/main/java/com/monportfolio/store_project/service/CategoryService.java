package com.monportfolio.store_project.service;

import com.monportfolio.store_project.entity.Category;
import com.monportfolio.store_project.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Trouve toutes les catégories qui commencent par un préfixe donné.
     */
    public List<Category> findCategoriesByPrefix( String prefix) {
        return categoryRepository.findByNameStartingWith(prefix);
    }
}