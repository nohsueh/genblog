# GenBlog

[English](../README.md) | [Español](README-es.md) | [Deutsch](README-de.md) | [日本語](README-ja.md) | [中文](README-zh.md)

## Présentation du Projet

GenBlog est un système de blog moderne construit avec Next.js, prenant en charge la gestion de contenu multilingue. Il offre une interface utilisateur élégante et des fonctionnalités de gestion puissantes, vous permettant de créer et gérer facilement le contenu de votre blog.

![/path/to/your/blog/console page](../imgs/dashboard-create.png "/path/to/your/blog/console page")

## Fonctionnalités Principales

- 📝 Génération de contenu de blog basée sur l'IA + Moteur de recherche + Web Crawler
- 💻 Support du déploiement sur n'importe quel chemin de votre site web
- 🌐 Support multilingue (Anglais, Espagnol, Allemand, Japonais, Français, Chinois)
- 🔍 Optimisation SEO, robots.txt, sitemap_index.xml, ads.txt, etc.
- 📱 Design responsive, adapté aux mobiles
- 🎨 Interface utilisateur moderne
- 🔒 Système d'authentification sécurisé
- 📊 Gestion des groupes de blogs
- 🔄 Prévisualisation et édition en temps réel

## Stack Technologique

- **Framework Frontend**: Next.js 15
- **Composants UI**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **Traitement du Contenu**:
  - Support Markdown
  - Mise en évidence du code avec Prism.js
- **Gestion d'État**: React Hooks
- **Style**: Tailwind CSS
- **Internationalisation**: Support multilingue intégré

## Démarrage Rapide

### Prérequis

- [Compte Vercel](https://vercel.com)
- [Compte Searchlysis](https://searchlysis.com)

### Étapes de Déploiement sur Vercel

1. Fork du projet

   - Visitez le [dépôt GitHub de GenBlog](https://github.com/nohsueh/genblog)
   - Cliquez sur le bouton "Fork" en haut à droite pour copier le projet dans votre compte GitHub

2. Importation vers Vercel

   - Connectez-vous à [Vercel](https://vercel.com)
   - Cliquez sur le bouton "Add New..."
   - Sélectionnez "Project"
   - Dans la section "Import Git Repository", sélectionnez votre dépôt GenBlog forké
   - Cliquez sur "Import"

3. Configuration du projet

   - Sur la page de configuration du projet, conservez les paramètres par défaut
   - Cliquez sur "Environment Variables" pour ajouter les variables d'environnement suivantes :

   ```env
   # Configuration requise
   NEXT_PUBLIC_APP_NAME="Nom de votre application"
   NEXT_PUBLIC_ROOT_DOMAIN="Votre domaine"
   SEARCHLYSIS_API_KEY="Votre clé API searchlysis"
   PASSWORD="Votre mot de passe administrateur"

   # Configuration optionnelle
   NEXT_PUBLIC_BASE_PATH="/path/to/your/blog"  # Si votre blog n'est pas déployé à la racine
   NEXT_PUBLIC_APP_DESCRIPTION="Description de votre application"
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="Votre code de vérification Google"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT="Votre compte Google AdSense"
   ```

4. Déploiement du projet

   - Cliquez sur le bouton "Deploy"
   - Vercel démarrera automatiquement le processus de build et de déploiement
   - Attendez la fin du déploiement, généralement 1-2 minutes

5. Configuration du domaine personnalisé (optionnel)

   - Dans le tableau de bord du projet Vercel, cliquez sur "Settings"
   - Sélectionnez "Domains"
   - Ajoutez votre domaine personnalisé
   - Suivez les instructions de Vercel pour configurer les enregistrements DNS

6. Vérification du déploiement

   - Visitez votre URL de déploiement Vercel ou votre domaine personnalisé
   - Confirmez que le site web fonctionne correctement
   - Testez la fonctionnalité de connexion administrateur (yourdomain.com/path/to/your/blog/[en | es | de | ja | fr | zh]/console)
   - Vérifiez que le changement de langue fonctionne correctement

7. Héberger un blog sur le sous-chemin /path/to/your/blog (en utilisant Next.js comme exemple)
   - Ajouter un proxy inverse dans `next.config.ts`

```ts next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/path/to/your/blog",
        destination: "https://yoursubdomain.vercel.app/path/to/your/blog",
      },
      {
        source: "/path/to/your/blog/:path*",
        destination: "https://yoursubdomain.vercel.app/path/to/your/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## Guide de Déploiement

### Guide des Variables d'Environnement

- `NEXT_PUBLIC_APP_NAME`: Nom de votre blog, affiché dans les onglets du navigateur et les titres de page
- `NEXT_PUBLIC_ROOT_DOMAIN`: Domaine de votre site web, utilisé pour les liens canoniques et le partage sur les réseaux sociaux
- `SEARCHLYSIS_API_KEY`: Clé API Searchlysis pour l'analyse et la génération de contenu
- `PASSWORD`: Mot de passe de connexion administrateur
- `NEXT_PUBLIC_BASE_PATH`: Définissez cette valeur si votre blog n'est pas déployé à la racine
- `NEXT_PUBLIC_APP_DESCRIPTION`: Description du site web pour le SEO
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Code de vérification Google Search Console
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`: Compte Google AdSense pour l'affichage des publicités

## Contribution

Les pull requests et les rapports de problèmes sont les bienvenus pour améliorer le projet.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](../LICENSE) pour plus de détails
