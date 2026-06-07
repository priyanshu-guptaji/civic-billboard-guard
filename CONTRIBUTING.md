# Contributing to Civic Billboard Guard 🤝

Thank you for your interest in contributing to **Civic Billboard Guard**! We welcome contributions from developers, designers, and civic-tech enthusiasts.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issues & Feature Requests](#issues--feature-requests)
- [Code of Conduct](#code-of-conduct)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- Familiarity with React, TypeScript, and Tailwind CSS

### Fork & Clone
```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/<your-username>/civic-billboard-guard.git
cd civic-billboard-guard

# Add upstream remote
git remote add upstream https://github.com/priyanshu-guptaji/civic-billboard-guard.git
```

---

## 💻 Development Setup

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will run at `http://localhost:8080`

### Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 📁 Project Structure

```
civic-billboard-guard/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page-level components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions & business logic
│   ├── contexts/         # React Context providers
│   ├── assets/           # Images, icons, static files
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

---

## 🔧 Making Changes

### Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-name
# or
git checkout -b docs/update-docs
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Code Style Guidelines

**TypeScript:**
- Use explicit type annotations
- Avoid `any` type; use `unknown` with proper type guards
- Use `const` by default, `let` when necessary, avoid `var`

**React:**
- Use functional components with hooks
- Keep components small and single-responsibility
- Use meaningful component names (PascalCase)
- Add JSDoc comments for complex components

**Styling:**
- Use Tailwind CSS utilities (no inline styles)
- Follow the existing color scheme and spacing scale
- Ensure responsive design for mobile, tablet, and desktop

**Example Component:**
```typescript
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

/**
 * ReportCard displays a single report with metadata
 * @param report - The report object to display
 * @param onDelete - Callback when delete button is clicked
 */
export const ReportCard: React.FC<{
  report: Report;
  onDelete: (id: string) => void;
}> = ({ report, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(report.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <h3 className="font-semibold">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.description}</p>
      <Button onClick={handleDelete} disabled={isLoading}>
        Delete
      </Button>
    </div>
  );
};
```

---

## 📝 Commit Guidelines

Write clear, descriptive commit messages following this format:

```
[type]: Brief description (50 chars max)

Detailed explanation if needed (72 chars per line max)

Fixes #123
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build, dependencies, etc.

**Examples:**
```
feat: Add AR verification for billboard location
fix: Resolve inconsistent localStorage keys for reports
docs: Update installation instructions
test: Add unit tests for gamification logic
```

---

## 🔀 Pull Request Process

### Before You Submit

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run linting:**
   ```bash
   npm run lint
   ```

3. **Test your changes locally:**
   - Run `npm run dev`
   - Manually test the feature/fix
   - Check responsive design

### Submit Your PR

1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub with:
   - **Clear title** following the commit format
   - **Description** explaining what changed and why
   - **Screenshots** for UI changes
   - **Related issues** (e.g., "Closes #123")

3. **PR Description Template:**
   ```markdown
   ## Description
   Brief explanation of the change

   ## Related Issue(s)
   Closes #123

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Breaking change
   - [ ] Documentation update

   ## Changes Made
   - Item 1
   - Item 2

   ## Testing
   How to test these changes

   ## Screenshots (if UI changes)
   [Include screenshots/GIFs]

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Linting passes (`npm run lint`)
   - [ ] Self-reviewed my code
   - [ ] Comments added for complex logic
   - [ ] No new console errors
   - [ ] Responsive design tested
   ```

### Review Process

- At least one maintainer approval required
- All conversations must be resolved
- CI checks must pass
- No merge conflicts

---

## 🐛 Issues & Feature Requests

### Reporting Issues

Use the GitHub Issues tab and include:
- Clear, descriptive title
- Step-by-step reproduction steps
- Expected vs actual behavior
- Environment (OS, browser, Node version)
- Screenshots/error logs if applicable

### Suggesting Features

Describe:
- Use case / problem it solves
- Proposed solution
- Alternative approaches considered
- Additional context / mockups

---

## 📊 Areas Needing Contributions

We're actively looking for help in:

- **Testing** - Unit and integration tests using Vitest
- **Accessibility** - WCAG 2.1 compliance improvements
- **Performance** - Bundle size optimization, lazy loading
- **Documentation** - User guides, API documentation
- **UI/UX** - Design improvements and responsive fixes
- **State Management** - Consolidating duplicate state logic
- **Backend Integration** - Preparing for real API integration

See open [Issues](https://github.com/priyanshu-guptaji/civic-billboard-guard/issues) for specific tasks!

---

## 🎯 Good First Issues

If you're new to the project, check out issues labeled `good-first-issue` or `beginner-friendly` to get started.

---

## 📞 Getting Help

- **Questions?** Open a [Discussion](https://github.com/priyanshu-guptaji/civic-billboard-guard/discussions)
- **Need guidance?** Comment on an Issue or PR
- **Chat with the community?** Engage in GitHub Discussions

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and professional
- Respect diverse perspectives
- Report violations to the maintainers

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## 🙏 Thank You

Your contributions help build safer, cleaner cities through technology. Thank you for being part of this mission! 🌆

---

**Questions?** Feel free to reach out to [@priyanshu-guptaji](https://github.com/priyanshu-guptaji) or the community via GitHub Issues/Discussions.
