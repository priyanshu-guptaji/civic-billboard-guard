# Setup Automated Testing Framework and GitHub Actions CI Pipeline

## Description

This PR strengthens the project's quality assurance process by introducing both an automated unit testing framework and a GitHub Actions CI pipeline. Together, these changes help prevent regressions, enforce code quality standards, and ensure that only validated code is merged into the `main` branch.

Resolves #15 and #16

## Changes Included

### 1. Automated Unit Testing Framework

* Installed testing dependencies:

  * `vitest`
  * `@testing-library/react`
  * `@testing-library/jest-dom`
  * `jsdom`
* Added test scripts to `package.json`:

  * `npm run test` → Executes tests in CI mode.
  * `npm run test:watch` → Runs tests in watch mode for development.
* Configured Vitest in `vite.config.ts` with a `jsdom` test environment.
* Added foundational unit tests:

  * `src/lib/gamification.test.ts`

    * `getCurrentBadge`
    * `getNextBadge`
  * `src/lib/reports.test.ts`

    * `normalizeReportStatus`
    * `getReportStatusIndex`
    * `reportStatusBadgeVariant`

### 2. GitHub Actions CI Pipeline

* Created a GitHub Actions workflow at `.github/workflows/ci.yml`.
* Configured the workflow to run on:

  * `push` events targeting `main`
  * `pull_request` events targeting `main`
* Added automated quality gates:

  * Dependency installation using `npm ci`
  * Linting via `npm run lint`
  * Type checking via `npx tsc --noEmit`
  * Build verification via `npm run build`
  * Automated test execution via `npm run test`

## Testing

* Successfully executed `npm run test`.
* Verified all test suites pass (14 tests total).
* Confirmed the project builds successfully using `npm run build:dev`.
* Validated TypeScript compilation with no new errors.
* Verified the GitHub Actions workflow runs successfully and passes all configured quality gates.

## Motivation and Impact

Prior to this PR, code quality relied primarily on manual verification and local development practices. This update introduces:

* Automated regression detection through unit tests.
* Consistent code quality enforcement through CI checks.
* Early detection of linting, typing, testing, and build issues.
* A strong foundation for future component, integration, and end-to-end testing.

These improvements enhance project reliability, reduce the likelihood of broken builds, and streamline the development workflow for contributors.
