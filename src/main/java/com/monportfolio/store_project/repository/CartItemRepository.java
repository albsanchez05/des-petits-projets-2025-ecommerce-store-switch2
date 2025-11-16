package com.monportfolio.store_project.repository;

import com.monportfolio.store_project.entity.CartItem;
import com.monportfolio.store_project.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>
{
    Optional<CartItem> findByProduct( Product product);
}
