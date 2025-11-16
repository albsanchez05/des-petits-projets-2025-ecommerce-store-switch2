package com.monportfolio.store_project.repository;

import com.monportfolio.store_project.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Spring va lire ce nom et le traduire en SQL:
    // "SELECT * FROM category WHERE name LIKE 'prefix%'"
    List<Category> findByNameStartingWith( String prefix);
}
