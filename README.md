# Boutique (site statique)

Catalogue de produits avec panier et commande par WhatsApp. HTML/CSS/JS pur, sans build.

## Personnaliser
- `js/config.js` : nom, textes, devise, numéro WhatsApp (format international sans +).
- `js/products.js` : vos produits. Ajoutez `image: "img/photo.jpg"` et placez la photo dans un dossier `img/`.
- `css/style.css` : couleurs dans `:root`.

## Déployer sur GitHub Pages
1. Créez un dépôt GitHub, puis envoyez-y tous ces fichiers (à la racine).
2. Dépôt > Settings > Pages > Source : "Deploy from a branch" > branche `main`, dossier `/ (root)` > Save.
3. Le site est en ligne après ~1 minute sur `https://VOTRE-NOM.github.io/NOM-DU-DEPOT/`.

Tester en local : ouvrez `index.html` dans le navigateur.
