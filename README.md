# Boutique E-Commerce "Switch 2" (Spring Boot & Java)

Ceci est un projet full-stack qui simule une boutique e-commerce complète, de la page produit jusqu'au panier d'achat. L'application est construite avec une architecture backend "API-first" (Spring Boot) et un frontend "vanilla" (HTML/CSS/JS).

L'application charge un catalogue complet de produits de la nouvelle Switch 2 et de catégories depuis des fichiers `.csv` au démarrage. Le projet a été extrait du dépôt https://github.com/florinpop17/app-ideas pour pratiquer mes compétences en développement web.



## 🛠️ Stack Technique

* **Backend:**
    * Java 17
    * Spring Boot 3 (Spring Web, Spring Data JPA)
    * H2 Database (Base de données en mémoire)
    * Lombok
    * OpenCSV (pour le parsing des données au démarrage)
* **Frontend:**
    * HTML5
    * CSS3 (Flexbox & Grid)
    * JavaScript (ES6+ avec `fetch` et `async/await`)

---

## 🚀 Fonctionnalités (Features)

* **Catalogue Dynamique :** L'application charge un catalogue de produits et de catégories depuis des fichiers CSV au démarrage en utilisant un `CommandLineRunner`.
* **Architecture Relationnelle :** Utilisation d'une relation `@ManyToOne` (Produits <-> Catégories). Le `CommandLineRunner` effectue le "stitching" (liaison) des clés étrangères en mémoire.
* **API REST Complète :**
    * `GET /api/products` (Trie par nouveauté)
    * `GET /api/products/{id}` (Page de détails)
    * `GET /api/products/byCategory/{name}` (Filtrage)
* **Panier Transactionnel ("Stateful") :**
    * `GET /api/cart` (Voir le panier)
    * `POST /api/cart/add` (Ajoute ou met à jour la quantité)
    * `POST /api/cart/update` (Change la quantité)
    * `DELETE /api/cart` (Vide le panier)
* **Frontend Multi-pages :** L'application gère 4 "vues" différentes (Accueil, Catégorie, Produit, Panier) en utilisant des fichiers JavaScript autonomes qui réutilisent des composants.
