# Plateforme de Tâches - Wivoo

Plateforme web permettant aux consultants de proposer et de se positionner sur des tâches internes, basée sur le design system de Wivoo.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- npm ou yarn

## Installation Locale

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine du projet (ou copiez le `.env.example`) :
   ```bash
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="une-cle-secrete-aleatoire"

   # Optionnel : Configuration Google SSO (nécessaire pour la connexion Google)
   # GOOGLE_CLIENT_ID=""
   # GOOGLE_CLIENT_SECRET=""

   # Optionnel : Resend API Key (pour l'envoi d'emails réels)
   # RESEND_API_KEY=""
   ```

3. **Préparer la base de données** :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Fonctionnement du Mode Démo

Pour tester l'application sans configuration Google SSO :
1. Allez sur la page de connexion.
2. Cliquez sur **"Accès Démo"**.
3. Vous pouvez choisir de vous connecter en tant qu'**Administrateur** (Thibault Ambert) ou en tant que **Consultant**.

## Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Base de données** : SQLite avec Prisma ORM
- **Authentification** : NextAuth.js v5
- **Animations** : Framer Motion
- **UI** : Tailwind CSS & Lucide Icons
- **Emails** : Resend
