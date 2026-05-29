# Setup Automated Unit Testing Framework

## Description
This PR addresses issue #16 by configuring an automated unit testing framework for the project using Vitest and React Testing Library. It introduces test scripts to `package.json`, sets up the test environment in `vite.config.ts`, and adds foundational unit tests for the core utility logic to prevent future regressions.

## Changes Included
- **Dependencies Installed**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
- **Configuration Updates**:
  - `package.json`: Added `test` (`vitest run`) and `test:watch` (`vitest`) scripts.
  - `vite.config.ts`: Configured Vitest reference and `jsdom` test environment.
- **Unit Tests Added**:
  - `src/lib/gamification.test.ts`: Added tests for `getCurrentBadge` and `getNextBadge` functions.
  - `src/lib/reports.test.ts`: Added tests for `normalizeReportStatus`, `getReportStatusIndex`, and `reportStatusBadgeVariant` functions.

## Testing
- Successfully ran `npm run test` ensuring all 14 tests in the two suites pass.
- Verified project builds successfully via `npm run build:dev` with no new TypeScript errors.

## Impact
This lays the foundation for future testing of UI components and business logic, promoting better code quality and faster developer iterations.
