# Blog Builder

[Chinese](README-zh.md)

A modern blog building platform built with Next.js 15+, providing powerful blog creation and management features.

## Features

- 🚀 Modern architecture based on Next.js 15+
- 🎨 Responsive design with Tailwind CSS
- 🛠️ Rich UI component library (Shadcn UI)
- 📝 Markdown editing support
- 🌐 Internationalization support
- 📱 Mobile optimization

## Tech Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hook Form
- **Date Handling**: date-fns
- **Authentication**: JSON Web Token

## Installation Steps

1. Clone the repository
```bash
git clone [your repository URL]
cd blog-builder
```

2. Install dependencies
```bash
pnpm install
```

3. Copy environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
pnpm dev
```

## Usage

1. Access `http://localhost:3000` to start the development server
2. Use the provided UI components for blog creation
3. Edit and publish blog content through the management interface

## Project Structure

```
blog-builder/
├── app/                 # Next.js application routes
├── components/         # React components
├── hooks/             # Custom React Hooks
├── lib/               # Utility functions and configurations
├── public/            # Static resources
└── styles/            # Global styles
```

## Development Standards

- Use TypeScript for type checking
- Follow ESLint standards
- Use Prettier for code formatting

## Contribution Guidelines

1. Fork the repository
2. Create a new feature branch
3. Submit changes
4. Submit a Pull Request

## License

MIT License