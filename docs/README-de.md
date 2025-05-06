# GenBlog

[English](../README.md) | [Español](README-es.md) | [日本語](README-ja.md) | [Français](README-fr.md) | [中文](README-zh.md)

## Projektvorstellung

GenBlog ist ein modernes Blog-System, das mit Next.js entwickelt wurde und mehrsprachige Inhaltsverwaltung unterstützt. Es bietet eine elegante Benutzeroberfläche und leistungsstarke Verwaltungsfunktionen, mit denen Sie Blog-Inhalte einfach erstellen und verwalten können.

![/path/to/your/blog/console page](../imgs/dashboard-create.png "/path/to/your/blog/console page")

## Hauptfunktionen

- 📝 KI + Suchmaschine + Web-Crawler basierte Batch-Blog-Inhaltsgenerierung
- 💻 Unterstützung für die Bereitstellung auf beliebigen Pfaden Ihrer Website
- 🌐 Mehrsprachige Unterstützung (Englisch, Spanisch, Deutsch, Japanisch, Französisch, Chinesisch)
- 🔍 SEO-Optimierung, robots.txt, sitemap_index.xml, ads.txt usw.
- 📱 Responsives Design, mobilfreundlich
- 🎨 Moderne Benutzeroberfläche
- 🔒 Sicheres Authentifizierungssystem
- 📊 Blog-Gruppenverwaltung
- 🔄 Echtzeit-Vorschau und Bearbeitung

## Technologie-Stack

- **Frontend-Framework**: Next.js 15
- **UI-Komponenten**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **Inhaltsverarbeitung**:
  - Markdown-Unterstützung
  - Prism.js Code-Hervorhebung
- **Zustandsverwaltung**: React Hooks
- **Styling**: Tailwind CSS
- **Internationalisierung**: Integrierte mehrsprachige Unterstützung

## Schnellstart

### Anforderungen

- [Vercel-Konto](https://vercel.com)
- [Searchlysis-Konto](https://searchlysis.com)

### Vercel-Bereitstellungsschritte

1. Projekt forken

   - Besuchen Sie das [GenBlog GitHub-Repository](https://github.com/nohsueh/genblog)
   - Klicken Sie auf die Schaltfläche "Fork" oben rechts, um das Projekt in Ihr GitHub-Konto zu kopieren

2. In Vercel importieren

   - Melden Sie sich bei [Vercel](https://vercel.com) an
   - Klicken Sie auf die Schaltfläche "Add New..."
   - Wählen Sie "Project"
   - Wählen Sie im Abschnitt "Import Git Repository" Ihr geforktes GenBlog-Repository aus
   - Klicken Sie auf "Import"

3. Projekt konfigurieren

   - Behalten Sie auf der Projektkonfigurationsseite die Standardeinstellungen bei
   - Klicken Sie auf "Environment Variables", um die folgenden Umgebungsvariablen hinzuzufügen:

   ```env
   # Erforderliche Konfiguration
   NEXT_PUBLIC_APP_NAME="Ihr Anwendungsname"
   NEXT_PUBLIC_ROOT_DOMAIN="Ihre Domain"
   SEARCHLYSIS_API_KEY="Ihr Searchlysis API-Schlüssel"
   PASSWORD="Ihr Administrator-Passwort"

   # Optionale Konfiguration
   NEXT_PUBLIC_BASE_PATH="/path/to/your/blog"  # Wenn Ihr Blog nicht im Root-Pfad bereitgestellt wird
   NEXT_PUBLIC_APP_DESCRIPTION="Ihre Anwendungsbeschreibung"
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="Ihr Google-Site-Verifizierungscode"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT="Ihr Google AdSense-Konto"
   ```

4. Projekt bereitstellen

   - Klicken Sie auf die Schaltfläche "Deploy"
   - Vercel startet automatisch den Build- und Bereitstellungsprozess
   - Warten Sie auf den Abschluss der Bereitstellung, normalerweise 1-2 Minuten

5. Benutzerdefinierte Domain konfigurieren (optional)

   - Klicken Sie im Vercel-Projektdashboard auf "Settings"
   - Wählen Sie "Domains"
   - Fügen Sie Ihre benutzerdefinierte Domain hinzu
   - Folgen Sie den Anweisungen von Vercel zur Konfiguration der DNS-Einträge

6. Bereitstellung überprüfen

   - Besuchen Sie Ihre Vercel-Bereitstellungs-URL oder benutzerdefinierte Domain
   - Stellen Sie sicher, dass die Website ordnungsgemäß funktioniert
   - Testen Sie die Administrator-Anmeldefunktion (yourdomain.com/path/to/your/blog/[en | es | de | ja | fr | zh]/console)
   - Überprüfen Sie, ob der Sprachwechsel korrekt funktioniert

7. Hosten Sie einen Blog im Unterpfad /path/to/your/blog (Beispiel: Next.js).
   - Fügen Sie einen Reverse-Proxy in `next.config.ts` hinzu.

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
        destination:
          "https://yoursubdomain.vercel.app/path/to/your/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## Bereitstellungshandbuch

### Umgebungsvariablen-Handbuch

- `NEXT_PUBLIC_APP_NAME`: Ihr Blog-Name, angezeigt in Browser-Tabs und Seitentiteln
- `NEXT_PUBLIC_ROOT_DOMAIN`: Ihre Website-Domain, verwendet für kanonische Links und Social-Media-Sharing
- `SEARCHLYSIS_API_KEY`: Searchlysis API-Schlüssel für Inhaltsanalyse und -generierung
- `PASSWORD`: Administrator-Anmeldepasswort
- `NEXT_PUBLIC_BASE_PATH`: Setzen Sie diesen Wert, wenn Ihr Blog nicht im Root-Pfad bereitgestellt wird
- `NEXT_PUBLIC_APP_DESCRIPTION`: Website-Beschreibung für SEO
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console-Verifizierungscode
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`: Google AdSense-Konto für die Anzeige von Werbung

## Mitwirken

Pull-Requests und Problemberichte sind willkommen, um das Projekt zu verbessern.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](../LICENSE)-Datei für Details
