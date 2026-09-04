# Contributing Guidelines

Hey, INTELL Engineer. We are glad to have you contribute to INTELL Frontend. INTELL is an AI-powered energy monitoring and optimization platform that helps households, businesses, installers, and orga

Your contributions help us deliver secure, reliable, and user-friendly experiences for users who need real-time energy visibility, intelligent alerts, savings tracking, AI guidance, multi-site monitor

We value collaboration, clarity, and high-quality code. Please review these guidelines to ensure a smooth contribution process.

---

## Table of Contents

- How to Contribute
- Pull Request Process
- Commit Message Guidelines
- Coding Standards
- Issue Reporting
- Branching Model
- Testing
- Documentation
- Additional Resources

---

## 1. How to Contribute

We welcome contributions in many forms:

- Bug Reports: Submit detailed issues if you encounter a bug, such as auth refresh failures, dashboard data errors, notification issues, or inverter connection problems.
- Feature Requests: Suggest enhancements, such as new inverter integrations, richer alert controls, report improvements, installer workflows, or multi-site monitoring tools.
- Code Contributions: Fix bugs or implement new features across domains such as auth, onboarding, dashboard, alerts, reports, AI assistant, settings, team access, and super admin.
- Documentation: Improve our docs, folder structure explanations, backend contract notes, or onboarding guides.

For significant changes, please open an issue first to discuss your idea with the team.

---

## 2. Pull Request Process

- Base Branch: Always branch off `dev`. PRs must be raised against `dev`, never against `main`.
- Small, Focused Changes: Each PR should solve one issue or implement one feature when possible.
- Clear Title and Summary: Use descriptive titles and explain your changes, rationale, and testing steps.
- Follow Feedback: Address review comments and update your PR accordingly.
- CI/CD Compliance: Ensure linting, formatting, type checks, and relevant manual checks pass before submission.

Only the project lead can merge `dev` to `main` once stability is verified.

---

## 3. Commit Message Guidelines

We follow the Conventional Commits specification.

Format:

```text
<type>(<scope>): <description>
```

Types:

- `feat`: New feature, such as inverter team access or notification settings
- `fix`: Bug fix, such as preserving auth after refresh or correcting dashboard empty states
- `docs`: Documentation changes
- `style`: Code style changes, formatting, or UI polish
- `refactor`: Code refactoring without feature or bug changes
- `test`: Adding or updating tests
- `chore`: Build process, tooling, or dependency updates

Examples:

```text
feat(alerts): add inverter alert filters
fix(auth): refresh access token before retrying protected requests
docs(readme): update INTELL product overview
```

---

## 4. Coding Standards

- Consistency: Follow the existing folder and domain structure.
- UI Consistency: Use the existing design system, shadcn UI components, dashboard cards, tables, forms, charts, colors, and typography patterns.
- API Contracts: Keep frontend service layers aligned with backend response shapes and avoid hardcoding backend-owned state.
- Linting and Formatting: Code must pass ESLint and the repository formatting conventions before committing.
- Readability: Write clean, maintainable code with clear names and focused components.
- Security: Prioritize secure coding practices, especially around authentication, refresh tokens, cookies, inverter credentials, and user data.

---

## 5. Issue Reporting

When reporting an issue:

1. Provide a clear description, such as "dashboard logs out after access token expiry" or "team invite link returns 404".
2. Include steps to reproduce.
3. Add screenshots, logs, network traces, or API responses where relevant.
4. Mention the affected route, browser, environment, and user role.
5. Suggest potential fixes if possible.

---

## 6. Branching Model

- Feature Branches: `feat/<short-description>`
- Bugfix Branches: `fix/<short-description>`
- Hotfix Branches: Reserved for urgent fixes directly on `main` by the lead only.

Examples:

```text
feat/super-admin-dashboard
fix/auth-refresh-token-retry
docs/intell-contributing-guide
```

Regularly pull from `dev` to keep your branch updated.

---

## 7. Testing

- Automated Tests: Add or update tests for new features or bug fixes when the change has logic worth protecting.
- Local Testing: Run all relevant checks locally before PR submission.
- Manual Verification: Confirm functionality across relevant browsers and devices, especially auth, onboarding, inverter connection, alerts, reports, notifications, and dashboard flows.

Recommended commands:

```bash
pnpm lint
pnpm typecheck
```

Use `pnpm build` when changes affect routing, metadata, providers, server components, or production-only behavior.

---

## 8. Documentation

- Update `README.md` when adding or modifying major features.
- Update domain-specific docs or constants when backend contracts change.
- Add inline comments only where the code is not self-explanatory.
- Keep PR descriptions clear enough for frontend and backend engineers to understand user flows, API dependencies, and testing coverage.

---

## 9. Additional Resources

- [How to write the perfect pull request](https://github.com/blog/1943-how-to-write-the-perfect-pull-request)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [`README.md`](./README.md)

---

Thank you for contributing to INTELL Frontend and helping us build a reliable platform for energy monitoring, optimization, and solar inverter management.
