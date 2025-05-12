# Playwright Test Automation Framework

## Framework Structure and Rationale

This project implements a robust test automation framework using Playwright, designed to support both UI and API testing across multiple environments.

### Directory Structure

```
├── api/                  # API client and utilities
│   └── APIClient.ts      # Reusable API client with request methods
├── config/               # Configuration files
│   ├── environments.ts   # Environment-specific settings
│   └── test-config.ts    # Configuration loader
├── fixtures/             # Reusable test fixtures
│   ├── api-fixture.ts    # API testing fixtures
│   └── auth-fixtures.ts  # Authentication fixtures
├── pages/                # Page Object Models
│   ├── BasePage.ts       # Base page with common methods
│   ├── DashboardPage.ts  # Dashboard page interactions
│   └── LoginPage.ts      # Login page interactions
├── tests/                # Test files
│   ├── api/              # API tests
│   └── ui/               # UI tests
│       ├── login/        # Login-related tests
│       └── search/       # Search functionality tests
├── playwright.config.ts  # Main Playwright configuration
└── api-playwright.config.ts # API-specific configuration
```

### Design Principles

1. **Page Object Model (POM)**: Separates test logic from page interactions, making tests more maintainable.

2. **Fixtures**: Provides reusable test setup and teardown, reducing code duplication.

3. **Environment Configuration**: Supports multiple environments (dev, staging, prod) with environment-specific settings.

4. **API Client**: Implements a reusable API client with comprehensive request methods and error handling.

5. **Separation of Concerns**: Clearly separates UI tests from API tests.

## Setup and Execution

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

#### Basic Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:api` | Run API tests only |
| `TEST_ENV=dev npm test` | Run all tests in dev environment |
| `TEST_ENV=staging npm test` | Run all tests in staging environment |
| `TEST_ENV=prod npm test` | Run all tests in production environment |

#### Environment-Specific Commands

```bash
# Development environment
npm run test:dev

# Staging environment
npm run test:staging

# Production environment
npm run test:prod
```

#### API Tests in Specific Environments

```bash
# API tests in development
TEST_ENV=dev npm run test:api

# API tests in staging
TEST_ENV=staging npm run test:api

# API tests in production
TEST_ENV=prod npm run test:api
```

#### Browser-Specific Tests

```bash
# Run in Chrome only
npm run test:chromium

# Run in Firefox only
npm run test:firefox

# Run in Safari only
npm run test:webkit
```

#### Running Specific Test Files

```bash
# Run a specific test file
npx playwright test tests/ui/login/valid-login.spec.ts

# Run tests matching a pattern
npx playwright test tests/ui/login/
```

#### Enabling Tracing

Tracing provides detailed step-by-step recording of test execution, which is helpful for debugging:

```bash
# Enable tracing for all tests
npx playwright test --trace on

# Enable tracing only for retries (default configuration)
npx playwright test --trace on-first-retry

# Enable tracing only for failed tests
npx playwright test --trace on-failure
```

You can also run tests with tracing in specific environments:

```bash
# Run tests in staging with tracing enabled
TEST_ENV=staging npx playwright test --trace on
```

### Viewing Test Reports

After test execution, HTML reports are generated automatically. To view the report:

```bash
npx playwright show-report
```

When tracing is enabled, you can:
1. Open the HTML report
2. Click on a test
3. Click the "Traces" tab
4. View the step-by-step execution with screenshots, network requests, and console logs

## Configuration

### Environment Variables

- `TEST_ENV`: Sets the test environment (dev, staging, prod)
- `CI`: When set, adjusts test behavior for CI environments

### Customizing Test Execution

Edit the configuration files to customize test execution:

- `playwright.config.ts`: Main configuration for UI tests
- `api-playwright.config.ts`: Configuration for API tests
- `config/environments.ts`: Environment-specific settings

## CI/CD Integration

This framework supports multiple CI/CD platforms:

- **GitLab CI**: Configuration in `.gitlab-ci.yml`
- **Jenkins**: Configuration in `Jenkinsfile`
- **Azure DevOps**: Configuration in `azure-pipelines.yml`

Each CI configuration includes jobs for both UI and API tests across different environments.
