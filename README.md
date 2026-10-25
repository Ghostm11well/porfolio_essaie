# Portfolio de Johan

Portfolio personnel statique de **Johan**, orateur, écrivain et maître de cérémonie.

Le site a été conçu comme une pièce éditoriale plutôt qu’un CV en ligne : une direction
artistique encre / papier / cuivre, une typographie de revue, un portrait mis en scène
et des transitions discrètes. Aucun contenu factuel (diplôme, prix, ouvrage, événement,
collaboration, notoriété) n’a été inventé.

## Aperçu

- HTML, CSS et JavaScript natifs — aucune dépendance, aucun outil de build.
- Polices auto-hébergées : **Cormorant Garamond** et **Manrope** (licences OFL incluses).
- Responsive téléphone / tablette / ordinateur.
- Navigation clavier, menu mobile avec gestion du focus, lien d’évitement, dialogue
  accessible pour le portrait, respect de `prefers-reduced-motion`.
- Photo fournie par Johan utilisée sans déformation, recadrée par CSS (`object-fit: cover`).
- Aucun tracker, cookie ou service tiers.
- Les textes de positionnement sont une **base éditoriale provisoire** à valider avec Johan.
  Les informations factuelles manquantes sont signalées dans l’interface.

## Lancer le site en local

Depuis la racine du projet :

```bash
python -m http.server 8000
```

Puis ouvrir <http://127.0.0.1:8000>.

Le site fonctionne aussi en ouvrant `index.html`, mais un petit serveur local garantit le
chargement homogène des polices et des images dans tous les navigateurs.

## Structure

```text
.
├── index.html                  # Page unique, contenu et sections
├── assets/
│   ├── css/styles.css          # Direction artistique et responsive
│   ├── fonts/                  # Polices auto-hébergées + licences
│   ├── icons/                  # Favicon et icône iOS
│   ├── images/
│   │   ├── johan-portrait.jpg  # Portrait principal (fallback)
│   │   ├── johan-portrait.webp # Portrait principal (WebP)
│   │   ├── og-image.jpg        # Carte de partage 1200 × 630
│   │   └── source-portrait.jpeg # Fichier source fourni
│   └── js/
│       ├── site-config.js      # Coordonnées et réseaux à compléter
│       └── main.js             # Interactions, accessibilité, hydratation
├── CONTENU-A-COMPLETER.md      # Liste des informations à fournir
├── README.md
└── .gitignore
```

## Personnaliser

### 1. Coordonnées professionnelles et réseaux

Tout est centralisé dans `assets/js/site-config.js` :

```js
window.JOHAN_CONFIG = {
  email: "",
  phone: "",
  socials: {
    linkedin: "",
    instagram: ""
  }
};
```

Il suffit de renseigner les valeurs pour que les emplacements « à venir » se transforment
automatiquement en liens actifs :

- l’adresse e-mail devient un lien `mailto:` dans la section Contact et le pied de page ;
- le téléphone remplace « À renseigner » ;
- les liens LinkedIn / Instagram deviennent des liens externes sécurisés
  (`target="_blank"` + `rel="noopener noreferrer"`).

Sans valeur renseignée, aucun faux lien n’est créé : les emplacements restent explicitement
en attente. Le détail des informations attendues se trouve dans `CONTENU-A-COMPLETER.md`.

### 2. Portrait

Le portrait principal est intégré dans trois contextes : hero, galerie et lightbox.
Pour le remplacer, conserver le même cadrage et fournir :

- `assets/images/johan-portrait.webp` (format portrait, idéalement 4:5 ou plus haut) ;
- `assets/images/johan-portrait.jpg` (fallback JPEG) ;
- idéalement `assets/images/og-image.jpg` (1200 × 630) pour les partages.

Mettre à jour l’attribut `alt` dans `index.html` si la description de la photo change.
Le cadrage CSS se règle sur `.portrait-frame__media img` et `.gallery-item__link img`
(`object-position`). Aucune déformation n’est appliquée.

### 3. Contenus factuels

Les informations à fournir sont listées dans `CONTENU-A-COMPLETER.md`. Les emplacements
sont identifiables dans le HTML :

- **À propos** : `.about__body`, `.about__pending` ;
- **Prise de parole** : `.format-list` ;
- **Écriture** : `.writing__fragment`, `.library__list` ;
- **Maître de cérémonie** : `.ceremony__mosaic` ;
- **Expériences** : `.experience__grid` (cartes « Archive / 01 »…) ;
- **Galerie** : `.gallery__grid` (blocs « Visuel à venir ») ;
- **Contact** : section `#contact` et `site-config.js`.

Prérequis : ne pas publier de citation, prix, ouvrage, événement ou collaboration sans
information vérifiée et accord explicite de Johan. Les textes de présentation actuels sont
volontairement généraux : ils doivent être relus et validés.

### 4. Ajouter une expérience

Remplacer une carte `.experience-card` vide par les informations fournies. Exemple de
structure à conserver :

```html
<article class="experience-card" data-reveal>
  <div class="experience-card__top">
    <span class="experience-card__index">Archive / 01</span>
    <span class="tag tag--outline">2025</span>
  </div>
  <p class="experience-card__year">2025</p>
  <h3 class="experience-card__title">Titre vérifié de l’expérience</h3>
  <p class="experience-card__meta">Type · Lieu · Année</p>
  <p class="experience-card__text">Contexte et rôle de Johan, uniquement d’après les informations fournies.</p>
</article>
```

Pour une œuvre ou un événement, remplacer de la même manière le contenu « À venir » du
bloc concerné, sans ajouter de données non fournies.

### 5. Référencement et partage

- Titre, description et données structurées `Person` sont déjà présents dans `<head>`.
- La carte Open Graph est `assets/images/og-image.jpg`.
- Une fois le domaine de publication connu, remplacer les URL relatives `og:image` et
  `twitter:image` par des URL absolues pour un aperçu de partage fiable.

## Déploiement

Le dépôt cible est <https://github.com/Ghostm11well/porfolio_essaie>.

Pour une mise en ligne via **GitHub Pages** :

1. pousser les fichiers sur la branche `main` ;
2. ouvrir **Settings → Pages** sur le dépôt ;
3. choisir **Deploy from a branch**, branche `main`, dossier `/ (root)` ;
4. enregistrer, puis vérifier l’URL publiée.

Aucun build n’est nécessaire.

## Accessibilité et mouvements

- Lien d’évitement, structure de titres, landmarks, noms accessibles.
- Menu mobile : `aria-expanded`, focus déplacé dans le menu puis restitué, fermeture avec
  `Échap`, fond de page rendu inerte.
- Lightbox native `<dialog>` : clavier, fermeture par `Échap` ou clic sur le fond, focus
  rendu au déclencheur.
- Contrastes vérifiés pour le texte courant.
- Animations désactivées avec `prefers-reduced-motion: reduce`.

## Crédits

- Portrait : fourni par Johan.
- Typographies : Cormorant Garamond et Manrope, distribuées sous SIL Open Font License.
  Les fichiers de licence accompagnent les polices dans `assets/fonts/`.
- Design et développement : réalisation sur mesure pour ce portfolio.

Les textes et la photographie ne sont pas libres de réutilisation.
