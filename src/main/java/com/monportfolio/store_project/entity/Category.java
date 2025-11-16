package com.monportfolio.store_project.entity;

import jakarta.persistence.*;
import lombok.*;
import com.opencsv.bean.CsvBindByName;

@Entity
@Data
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id; // ID interne (pour la BDD)

    @CsvBindByName(column = "id")
    private long externalId; // ID du CSV (ex: 101, 102)

    @CsvBindByName(column = "category_name")
    private String name;
}