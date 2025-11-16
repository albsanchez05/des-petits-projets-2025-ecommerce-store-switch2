package com.monportfolio.store_project.service;

import com.monportfolio.store_project.entity.Product;
import com.monportfolio.store_project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired; // Importe l'injection
import org.springframework.stereotype.Service; // Importe l'annotation Service
import java.util.List; // On aura besoin de listes
import org.springframework.data.domain.Sort;



@Service
public class ProductService
{
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        // On dit à JPA de trier par la colonne "id", en ordre décroissant
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    /**
     * Récupère tous les produits pour un nom de catégorie donné.
     * @param categoryName Le nom de la catégorie (ex: "Consoles")
     * @return Une liste de produits
     */
    public List<Product> getProductsByCategoryName(String categoryName) {
        return productRepository.findAllByCategoryName(categoryName);
    }

    /**
     * Récupère un seul produit par son ID BDD.
     * @param id L'ID du produit (ex: 1, 2, 3...)
     * @return Le produit trouvé, ou une erreur
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id: " + id));
    }

}
