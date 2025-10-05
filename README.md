# Employee Management Application

> **A modern, responsive employee management system built with Web Components and LitElement**

This project is a comprehensive employee management application that allows you to manage employee data with features like CRUD operations, search, filtering, pagination, and multi-language support. Built with modern web standards using LitElement, Redux Toolkit for state management, and Vaadin Router for navigation.

## Features

- **Employee CRUD Operations** - Add, edit, delete, and view employee details
- **Advanced Search & Filtering** - Search by name, department, position
- **Pagination** - Efficient data handling with pagination controls
- **Multi-language Support** - English and Turkish localization with i18next
- **Responsive Design** - Responsive, modern dashboard interface
- **Data Persistence** - Local storage integration with middleware
- **Form Validation** - Comprehensive employee form validation
- **Confirmation Dialogs** - User-friendly confirmation for destructive actions
- **Modern Architecture** - Web Components with Redux state management

## Technologies Used

- **LitElement 3** - Modern web components framework
- **Redux Toolkit** - Predictable state management
- **Vaadin Router** - Client-side routing for SPAs
- **i18next** - Internationalization framework
- **Web Test Runner** - Modern testing framework
- **ESLint & Prettier** - Code quality and formatting

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/tunahankuzgun/employee-mgmt-app.git
   cd employee-mgmt-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run serve
   ```

4. **Open the app in your browser:**
   [http://localhost:8000](http://localhost:8000)

> **Note:** This project uses native ES modules and modern web standards. It requires a modern browser that supports Web Components.

## Testing

To run all tests:

```sh
npm test
```

Run tests in development mode:

```sh
npm run test:dev
```

Run tests in watch mode:

```sh
npm run test:watch
```

Generate test coverage report:

```sh
npm run test:coverage
```

## Building

This project doesn't require a build step for development as it uses native ES modules. For production optimization:

```sh
npm run serve:prod
```

## Project Structure

```
src/
  components/              # Web Components
    app-shell.js           # Main application shell
    employee-list.js       # Employee list view with table/card layouts
    employee-form.js       # Employee creation/editing form
    employee-table.js      # Data table component
    employee-card-list.js  # Card layout for mobile
    search-bar.js          # Search functionality
    navigation-menu.js     # App navigation
    language-selector.js   # Language switching
    confirmation-dialog.js # Confirmation dialogs
    employee-pagination.js # Pagination controls
  store/                   # Redux store configuration
    index.js               # Store setup
    slices/                # Redux slices
      employeesSlice.js    # Employee data management
      languageSlice.js     # Language state
      uiSlice.js           # UI state management
    middleware/            # Custom middleware
      localStorageMiddleware.js # Data persistence
  mixins/                  # Reusable mixins
    ReduxMixin.js          # Redux integration for components
  locales/                 # Internationalization
    en.js                  # English translations
    tr.js                  # Turkish translations
  utils/                   # Utility functions
    i18n.js                # Internationalization setup
    employeeHelpers.js     # Employee data helpers
  router.js                # Application routing
test/                      # Test files
docs/                      # Documentation
public/                    # Static assets
```

## Core Components

### Employee Management

- **Employee List** - View employees in table or card layout
- **Employee Form** - Add/edit employee information
- **Search & Filter** - Real-time search and department/position filtering
- **Pagination** - Navigate through large datasets

### State Management

- **Redux Store** - Centralized state management
- **Local Storage** - Automatic data persistence
- **Real-time Updates** - Reactive UI updates

### Internationalization

- **Multi-language** - English and Turkish support
- **Dynamic Switching** - Change language without page reload
- **Localized Content** - All UI text and labels translated

## Development Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `npm run serve`           | Start development server          |
| `npm run serve:prod`      | Start server in production mode   |
| `npm test`                | Run all tests (dev + prod)        |
| `npm run test:dev`        | Run tests in development mode     |
| `npm run test:prod`       | Run tests in production mode      |
| `npm run test:watch`      | Run tests in watch mode           |
| `npm run test:coverage`   | Generate test coverage report     |
| `npm run lint`            | Run ESLint and Lit Analyzer       |
| `npm run format`          | Format code with Prettier         |
| `npm run analyze`         | Generate custom elements manifest |
| `npm run ci:lint`         | Run linting for CI                |
| `npm run ci:test`         | Run tests with coverage for CI    |
| `npm run ci:security`     | Run security audit                |
| `npm run ci:format-check` | Check code formatting (CI)        |

## Continuous Integration (CI)

This project includes a comprehensive GitHub Actions workflow for continuous integration. Every push and pull request to the `master` branch will automatically:

- **Multi-Node Testing** - Test on Node.js 18.x and 20.x
- **Code Quality Checks** - Run ESLint and Lit Analyzer
- **Format Validation** - Ensure code follows Prettier formatting rules
- **Security Scanning** - Run npm audit for known vulnerabilities
- **Test Coverage** - Generate and upload coverage reports to Codecov
- **Cross-platform Testing** - Run tests on Ubuntu Linux environment

### CI Jobs

- **Test Job** - Runs tests with coverage across multiple Node.js versions
- **Lint Job** - Validates code quality and formatting
- **Security Job** - Performs security audits and vulnerability checks

You can find the workflow file at `.github/workflows/ci.yml`.
