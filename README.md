# GenBlog

[Español](docs/README-es.md) | [Deutsch](docs/README-de.md) | [日本語](docs/README-ja.md) | [Français](docs/README-fr.md) | [中文](docs/README-zh.md)

## Project Introduction

GenBlog is a modern blog system built with Next.js, supporting multilingual content management. It provides an elegant user interface and powerful management features, allowing you to easily create and manage blog content.

![/path/to/your/blog/console page](imgs/dashboard-create.png "/path/to/your/blog/console page")

## Key Features

- 📝 AI + Search Engine + Web Crawler based batch blog content generation
- 💻 Support for deployment to any path on your website
- 🌐 Multilingual support (English, Spanish, German, Japanese, French, Chinese)
- 🔍 SEO optimization, robots.txt, sitemap_index.xml, ads.txt, etc.
- 📱 Responsive design, mobile-friendly
- 🎨 Modern UI interface
- 🔒 Secure authentication system
- 📊 Blog group management
- 🔄 Real-time preview and editing

## Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Components**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **Content Processing**:
  - Markdown support
  - Prism.js code highlighting
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Internationalization**: Built-in multilingual support

## Quick Start

### Requirements

- [Vercel account](https://vercel.com)
- [Searchlysis account](https://searchlysis.com)

### Vercel Deployment Steps

1. Fork the project

   - Visit [GenBlog GitHub repository](https://github.com/nohsueh/genblog)
   - Click the "Fork" button in the top right to copy the project to your GitHub account

2. Import to Vercel

   - Log in to [Vercel](https://vercel.com)
   - Click the "Add New..." button
   - Select "Project"
   - In the "Import Git Repository" section, select your forked GenBlog repository
   - Click "Import"

3. Configure the project

   - On the project configuration page, keep the default settings
   - Click "Environment Variables" to add the following environment variables:

   ```env
   # Required configuration
   NEXT_PUBLIC_APP_NAME="Your application name"
   NEXT_PUBLIC_ROOT_DOMAIN="Your domain"
   SEARCHLYSIS_API_KEY="Your searchlysis API key"
   PASSWORD="Your admin password"

   # Optional configuration
   NEXT_PUBLIC_BASE_PATH="/path/to/your/blog"  # If your blog is not deployed at the root path
   NEXT_PUBLIC_APP_DESCRIPTION="Your application description"
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="Your Google site verification code"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT="Your Google AdSense account"
   ```

4. Deploy the project

   - Click the "Deploy" button
   - Vercel will automatically start the build and deployment process
   - Wait for deployment to complete, usually takes 1-2 minutes

5. Configure custom domain (optional)

   - In the Vercel project dashboard, click "Settings"
   - Select "Domains"
   - Add your custom domain
   - Follow Vercel's instructions to configure DNS records

6. Verify deployment

   - Visit your Vercel deployment URL or custom domain
   - Confirm the website is running properly
   - Test the admin login functionality (yourdomain.com/path/to/your/blog/[en | es | de | ja | fr | zh]/console)
   - Check if language switching works correctly

7. Host a blog on the /path/to/your/blog subpath (using Next.js as an example)
   - Add a reverse proxy in `next.config.ts`

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

## Deployment Guide

### Environment Variables Guide

- `NEXT_PUBLIC_APP_NAME`: Your blog name, displayed in browser tabs and page titles
- `NEXT_PUBLIC_ROOT_DOMAIN`: Your website domain, used for generating canonical links and social media sharing
- `SEARCHLYSIS_API_KEY`: Searchlysis API key for content analysis and generation
- `PASSWORD`: Admin login password
- `NEXT_PUBLIC_BASE_PATH`: Set this value if your blog is not deployed at the root path
- `NEXT_PUBLIC_APP_DESCRIPTION`: Website description for SEO
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console verification code
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`: Google AdSense account for displaying ads

## Contributing

Pull requests and issue reports are welcome to help improve the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
