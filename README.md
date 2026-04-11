# 🌿 Siniya Prestige — Application de Restauration Marocaine Premium

**Client:** Abdelkader Houari | **Consultant:** Ahmed Akafou

---

## Stack Technique

| Technologie | Usage |
|---|---|
| React Native (Expo 51) | Framework mobile |
| NativeWind (Tailwind CSS) | Styling |
| Firebase Firestore | Base de données |
| Firebase Auth | Authentification |
| Firebase Storage | Images |
| Firebase Cloud Functions | Backend logic (redevances, Zakat) |
| Zustand | State management global |
| React Navigation | Navigation (BottomTabs + Stack) |

## Design System

- **Background:** `#FDFaf6` (Soie)
- **Primary:** `#022C22` (Émeraude)
- **Accent:** `#B45309` (Or brossé)
- **Typographie:** Cinzel (Titres) + Montserrat (Corps)

---

## Structure du Projet

```
siniya-prestige/
├── App.tsx                     # Entry point
├── app.json                    # Expo config
├── eas.json                    # EAS Build config
├── firebase.json               # Firebase config
├── firestore.rules             # Sécurité Firestore
├── src/
│   ├── constants/
│   │   ├── colors.ts           # Palette Design System
│   │   ├── theme.ts            # Fonts, Spacing, Shadows
│   │   └── mockData.ts         # Données menu (15 plats)
│   ├── types/
│   │   └── index.ts            # TypeScript types complets
│   ├── store/
│   │   ├── cartStore.ts        # Panier (Zustand)
│   │   ├── userStore.ts        # Utilisateur + Fidélité
│   │   └── restaurantStore.ts  # Restaurants + Franchise
│   ├── services/
│   │   ├── firebase.ts         # Init Firebase
│   │   ├── menuService.ts      # CRUD Menu
│   │   └── orderService.ts     # Création commandes
│   ├── components/
│   │   ├── ui/                 # Button, Card, Badge, Modal
│   │   ├── menu/               # MenuItemCard, CategoryFilter, ChefCollection
│   │   ├── cart/               # CartItemCard
│   │   └── common/             # Header
│   ├── screens/
│   │   ├── MenuScreen.tsx      # 🏠 Écran principal (grid luxe)
│   │   ├── CartScreen.tsx      # 🛍️ Panier
│   │   ├── CheckoutScreen.tsx  # 💳 Paiement + pourboire digital
│   │   ├── OrderConfirmation.tsx # ✅ Confirmation + Zakat
│   │   ├── LoyaltyScreen.tsx   # ⭐ Cercle Siniya (fidélité)
│   │   ├── FranchiseDashboard.tsx # 📊 Dashboard franchisé
│   │   ├── ProfileScreen.tsx   # 👤 Profil utilisateur
│   │   ├── SearchScreen.tsx    # 🔍 Recherche
│   │   └── FavoritesScreen.tsx # ❤️ Favoris
│   ├── navigation/
│   │   ├── AppNavigator.tsx    # Stack principal
│   │   └── BottomTabNavigator.tsx # Tabs personnalisés (AR)
│   └── utils/
│       ├── calculations.ts     # Fidélité, Zakat, Franchise
│       └── formatters.ts       # Prix MAD, dates, status
└── functions/
    └── src/index.ts            # Cloud Functions Firebase
        ├── calculateMonthlyFranchiseFee  (Cron: fin de mois)
        ├── onOrderCreated                (Trigger Firestore)
        ├── onOrderStatusUpdate           (Notif push)
        ├── getFranchiseReport            (HTTP callable)
        ├── calculateRealtimeFee          (HTTP callable)
        └── archiveOldOrders              (Cron: hebdo)
```

---

## Installation

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/cortexai-2025/siniya-prestige.git
cd siniya-prestige
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Remplir avec vos clés Firebase
```

### 3. Ajouter les polices

Télécharger et placer dans `assets/fonts/`:
- [Cinzel](https://fonts.google.com/specimen/Cinzel): Regular, Bold, SemiBold
- [Montserrat](https://fonts.google.com/specimen/Montserrat): Regular, Medium, SemiBold, Bold, Light

### 4. Lancer l'application

```bash
npx expo start
```

---

## Build APK / AAB (via EAS)

```bash
# Installer EAS CLI
npm install -g eas-cli

# APK (preview/test)
eas build --platform android --profile preview

# AAB (production Play Store)
eas build --platform android --profile production
```

> Ou utilisez le ZIP GitHub avec **APK Factory** directement.

---

## Modules Fonctionnels

### Module Commande
- Fetch dynamique depuis Firestore (ou mock data)
- Panier global avec Zustand (quantités, suppléments payants)
- Checkout: "Sur Place" (Table ID) ou "À Emporter"

### Module Fidélité — Cercle Siniya
- 10 MAD = 1 point
- 4 niveaux: Bronze → Argent → Or → Platine
- Affichage en temps réel

### Module Zakat El Maal
- 2.5% du bénéfice net de chaque commande
- Affiché sur le reçu de confirmation
- Verset coranique: «وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ»

### Module Franchise Multi-tenant
- Gestion des IDs de locaux (60m² / 100m²)
- Dashboard franchisé: CA journalier/mensuel, commandes live
- Redevance 5% calculée automatiquement (Cloud Function)
- Localisation automatique du point de vente le plus proche

### Module Paiement (Stripe simulé)
- 3 méthodes: Espèces, Carte, Portefeuille digital
- Pourboire digital: 0%, 5%, 10%, 15%, montant libre

---

## Firebase Cloud Functions

| Fonction | Déclencheur | Description |
|---|---|---|
| `calculateMonthlyFranchiseFee` | Cron (fin de mois) | Calcule la redevance 5% |
| `onOrderCreated` | Firestore trigger | Attribue points + Zakat |
| `onOrderStatusUpdate` | Firestore trigger | Notif push client |
| `getFranchiseReport` | HTTP callable | Rapport mensuel |
| `calculateRealtimeFee` | HTTP callable | Calcul temps réel |
| `archiveOldOrders` | Cron (hebdo) | Archivage +3 mois |

---

## Déployer les Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

---

*Siniya Prestige © 2025 — All rights reserved*
