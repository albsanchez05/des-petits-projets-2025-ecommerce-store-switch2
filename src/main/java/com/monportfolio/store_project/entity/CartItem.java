package com.monportfolio.store_project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
public class CartItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID interne (pour la BDD)

    @ManyToOne
    private Product product;

    private  int quantity;

}
