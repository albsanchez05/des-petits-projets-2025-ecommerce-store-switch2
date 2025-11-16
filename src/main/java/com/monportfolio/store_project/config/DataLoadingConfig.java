package com.monportfolio.store_project.config;

import com.monportfolio.store_project.entity.Category;
import com.monportfolio.store_project.entity.Product;
import com.monportfolio.store_project.repository.CategoryRepository;
import com.monportfolio.store_project.repository.ProductRepository;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class DataLoadingConfig
{
    @Bean
    public CommandLineRunner loadData( CategoryRepository categoryRepo, ProductRepository productRepo) {
        return (args) -> {

            // --- 0. NETTOYAGE ---
            productRepo.deleteAll();
            categoryRepo.deleteAll();
            System.out.println("--- Tables vidées ---");

            // --- 1. CHARGER LES CATÉGORIES (categories.csv) ---
            // On utilise le CsvToBeanBuilder SIMPLE.
            List<Category> categories;
            try (Reader reader = new InputStreamReader(new ClassPathResource("data/categories.csv").getInputStream(), "windows-1252")) {

                categories = new CsvToBeanBuilder<Category>(reader)
                    .withType(Category.class)
                    .withSeparator(',') // On confirme la virgule
                    .withIgnoreLeadingWhiteSpace(true)
                    .build()
                    .parse();
            }
            categoryRepo.saveAll(categories);
            System.out.println("--- " + categories.size() + " Catégories chargées ---");

            // --- 2. CRÉER LA MAP DE LIAISON ---
            Map<Long, Category> categoryMap = categories.stream()
                .collect( Collectors.toMap(Category::getExternalId, category -> category));


            // --- 3. CHARGER LES PRODUITS (products.csv) ---
            // On utilise AUSSI le CsvToBeanBuilder SIMPLE.
            List<Product> products;
            try (Reader reader = new InputStreamReader(new ClassPathResource("data/products.csv").getInputStream(), "windows-1252")) {

                products = new CsvToBeanBuilder<Product>(reader)
                    .withType(Product.class)
                    .withSeparator(',') // On confirme la virgule
                    .withIgnoreLeadingWhiteSpace(true)
                    .build()
                    .parse();
            }
            System.out.println("--- " + products.size() + " Produits lus du CSV ---");

            // --- 4. "STITCHING" (LA LIAISON) ---
            // (Tes entités sont parfaites pour ça)
            for (Product product : products) {
                long categoryIdKey = product.getCategoryId(); // Lit le champ @Transient
                Category category = categoryMap.get(categoryIdKey); // Trouve la catégorie

                if (category != null) {
                    product.setCategory(category); // Attache la vraie relation
                } else {
                    System.out.println("Alerte: Produit '" + product.getTitle() + "' a un category_id inconnu: " + categoryIdKey);
                }
            }

            // --- 5. SAUVEGARDE FINALE ---
            productRepo.saveAll(products);

            System.out.println("--- " + productRepo.count() + " Produits valides chargés en BDD ---");
        };
    }
}
