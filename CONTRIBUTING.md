# Contributing to LitLens AI

First off, thank you for considering contributing to LitLens AI! It's people like you that make open source such a fantastic community to learn, inspire, and create.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else has already opened one. If not, feel free to open a new issue.

## 2. Setting up your environment

1. Fork the repo and clone your fork.
2. Ensure you have Node.js 18+ and `npm` installed.
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and fill in the required keys.
5. Run the development server: `npm run dev`

## 3. Architecture Overview

LitLens AI strictly adheres to **Clean Architecture**. Please review our [Architecture Documentation](docs/ARCHITECTURE.md) before submitting code.

* **UI Layer**: React components (`app/`, `components/`)
* **State Management**: Zustand stores (`stores/`), custom hooks (`hooks/`)
* **Services**: Business logic (`services/`)
* **Repositories**: Data access (`lib/repositories/`)
* **Infrastructure**: Supabase, Qdrant, OpenAI, Inngest (`lib/`)

Please avoid prop-drilling and direct database access from UI components.

## 4. Pull Request Process

1. Create a new branch for your feature (`feature/amazing-feature`) or bugfix (`fix/issue-123`).
2. Write clean, self-documenting code with TypeScript (no `any` types).
3. Ensure your code passes the build: `npm run build`
4. Open a Pull Request with a clear title and description.
5. Wait for a code review and address any feedback.

## 5. Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
