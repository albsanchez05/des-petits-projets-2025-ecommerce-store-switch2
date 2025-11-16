package com.monportfolio.store_project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.opencsv.bean.CsvBindByName;

@Entity
@Data
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    @CsvBindByName(column = "asin")
    private String asin;

    @CsvBindByName(column = "title")
    private String title;

    @Column(length = 1024)
    @CsvBindByName(column = "imgUrl")
    private String imageUrl;

    @Column(length = 1024)
    @CsvBindByName(column = "productURL")
    private String productURL;

    @CsvBindByName(column = "stars")
    private double stars;

    @CsvBindByName(column = "reviews")
    private int reviews;

    @CsvBindByName(column = "price")
    private String price;

    @CsvBindByName(column = "listPrice")
    private String listPrice;

    @CsvBindByName(column = "category_id")
    @Transient // <-- LA CLÉ : Dit à JPA d'ignorer ce champ
    @JsonIgnore
    private long categoryId; // Variable temporaire pour le CSV

    @CsvBindByName(column = "isBestSeller")
    private boolean isBestSeller;

    @CsvBindByName(column = "boughtInLastMonth")
    private int boughtInLastMonth;

    @CsvBindByName(column = "description")
    @Column(length = 2048) // On donne plus de place (2048 caractères)
    private String description;

    @ManyToOne // <-- LA VRAIE RELATION BDD
    private Category category; // Le vrai objet Catégorie
}
