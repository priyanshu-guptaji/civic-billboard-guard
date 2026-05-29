# Pull Request Draft

**Title:** Implement GitHub Actions CI Pipeline for Automated Quality Gates

**Description:**
This PR introduces an automated CI/CD pipeline via GitHub Actions to ensure code quality and prevent broken builds from being merged into the `main` branch. 

Resolves #15 

### Changes Made
- Created a new GitHub Actions workflow at `.github/workflows/ci.yml`.
- Configured the pipeline to trigger automatically on all `push` and `pull_request` events targeting the `main` branch.
- Added jobs to execute the following quality gates sequentially:
  - **Dependency Installation:** Uses `npm ci` for clean, reliable dependency resolution.
  - **Linting:** Runs `npm run lint` to enforce consistent code styling and catch early errors.
  - **Type Checking:** Runs `npx tsc --noEmit` to validate TypeScript typings across the project.
  - **Build Verification:** Runs `npm run build` to guarantee the production build succeeds without errors.

### Motivation and Context
Prior to this PR, code quality relied on local developer discipline, allowing syntax errors or build failures to slip into the main branch undetected. This CI workflow acts as an automated gatekeeper, ensuring all incoming code is structurally sound and adheres to repository standards before merging.

### Testing Instructions
1. Create a dummy PR or push a commit to a branch.
2. Navigate to the **Actions** tab in GitHub.
3. Verify that the "CI/CD Pipeline" triggers and successfully passes all steps (Install dependencies, Linter, Type-Checking, Build).
4. Introduce an intentional TypeScript error or linting violation in a separate commit and verify that the pipeline correctly fails and blocks the build.
