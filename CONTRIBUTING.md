# Contributing to Civic Billboard Guard 🏙️

Thank you for your interest in contributing! This guide will help you get started quickly.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Issues](#reporting-issues)
- [Tech Stack Overview](#tech-stack-overview)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors. Please be kind, constructive, and collaborative.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
```bash
   git clone https://github.com/<your-username>/civic-billboard-guard.git
   cd civic-billboard-guard
```
3. **Add the upstream remote:**
```bash
   git remote add upstream https://github.com/priyanshu-guptaji/civic-billboard-guard.git
```

---

## Development Setup

### Prerequisites

- Node.js `>= 18.x`
- npm or bun

### Install Dependencies

```bash
npm install
# or
bun install
```

### Start the Dev Server

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

### Other Useful Commands

| Command | Description |
|---|---|
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

src/
├── components/      # Reusable UI components (shadcn-ui based)
├── pages/           # Route-level page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── assets/          # Static assets (images, icons)
└── App.tsx          # Root application component

---

## How to Contribute

1. **Find or create an issue** — Check the [open issues](https://github.com/priyanshu-guptaji/civic-billboard-guard/issues) or open a new one describing what you'd like to fix or add.
2. **Comment on the issue** to let maintainers know you're working on it (avoids duplicate work).
3. **Sync your fork** before starting:
```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
```
4. **Create a feature branch** from `main`:
```bash
   git checkout -b feature/your-feature-name
```
5. **Make your changes**, then commit:
```bash
   git add .
   git commit -s -m "feat: add your feature description"
```
   > The `-s` flag adds a DCO sign-off, which is required for contributions.
6. **Push** your branch:
```bash
   git push origin feature/your-feature-name
```
7. **Open a Pull Request** against the `main` branch of the upstream repo.

---

## Branch Naming Convention

| Type | Pattern | Example |
|---|---|---|
| New feature | `feature/<short-description>` | `feature/pdf-export` |
| Bug fix | `fix/<short-description>` | `fix/localstorage-key` |
| Documentation | `docs/<short-description>` | `docs/add-contributing` |
| Refactor | `refactor/<short-description>` | `refactor/report-state` |
| Testing | `test/<short-description>` | `test/unit-setup` |

---

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

<type>: <short summary>
**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
feat: add PDF export for violation reports
fix: resolve inconsistent localStorage keys for reports
docs: add CONTRIBUTING.md
refactor: extract report card into reusable component

- Keep the summary under 72 characters
- Use the imperative mood ("add", "fix", not "added", "fixed")
- Reference the issue number in the PR description, not the commit

---

## Pull Request Guidelines

- **One PR per issue** — keep changes focused and reviewable.
- Fill in the PR template completely.
- Ensure `npm run lint` passes before opening a PR.
- Add screenshots or a short screen recording for UI changes.
- Link the related issue in your PR description:
Closes #<issue-number>
- Be responsive to reviewer feedback — update your branch and re-request review.

---

## Reporting Issues

When opening a new issue, please include:

- **A clear title** describing the problem or feature.
- **Steps to reproduce** (for bugs).
- **Expected vs. actual behavior.**
- **Screenshots or error messages** if applicable.
- **Environment:** OS, Node version, browser.

---

## Tech Stack Overview

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn-ui |
| Package Manager | npm / bun |

---

## Questions?

Open a [Discussion](https://github.com/priyanshu-guptaji/civic-billboard-guard/discussions) or drop a comment on the relevant issue. We're happy to help!

---

*Happy contributing! 🚀 Together, let's build safer cities.*