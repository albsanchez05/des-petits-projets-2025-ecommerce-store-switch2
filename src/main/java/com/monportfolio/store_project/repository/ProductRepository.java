package com.monportfolio.store_project.repository;

import com.monportfolio.store_project.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Spring va lire ce nom et comprendre :
    // "Trouve-moi les Produits (findAll) dont l'objet 'category'
    // a un attribut 'name' qui correspond."
    List<Product> findAllByCategoryName( String categoryName);
}