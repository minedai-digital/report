# Development Guide

This guide provides information for developers who want to contribute to the Medical Inspection Reports System.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Building and Deployment](#building-and-deployment)
7. [Contributing](#contributing)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- A modern web browser
- A code editor (VS Code recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd medical-inspection-reports
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
medical-inspection-reports/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet with responsive design
├── js/
│   ├── main.js         # Main application logic with ES6 modules
│   └── utils.js        # Utility functions for validation, formatting, and security
├── docs/
│   ├── README.md       # Documentation overview
│   ├── user-guide.md   # User guide
│   ├── api.md          # API documentation
│   ├── development.md  # Development guide
│   └── architecture.md # Architecture documentation
├── tests/
│   ├── test-runner.js  # Test runner
│   └── utils.test.js   # Unit tests for utility functions
├── assets/
│   └── fonts/          # Custom fonts (if any)
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Locked dependencies
├── README.md           # Project documentation
├── CHANGELOG.md        # Version history
├── LICENSE             # License information
└── .gitignore          # Files to ignore in version control
```

## Coding Standards

### JavaScript

1. **ES6 Modules**: Use ES6 import/export syntax
2. **Naming Conventions**: 
   - Variables and functions: camelCase
   - Classes and constructors: PascalCase
   - Constants: UPPER_CASE
3. **Documentation**: Use JSDoc for all functions and classes
4. **Error Handling**: Use try/catch blocks for all functions
5. **Validation**: Validate all inputs and outputs
6. **Security**: Sanitize all user inputs to prevent XSS attacks

### CSS

1. **Naming Conventions**: Use BEM methodology
2. **Responsive Design**: Use CSS Grid and Flexbox
3. **Accessibility**: Ensure proper contrast and ARIA attributes
4. **Performance**: Minimize reflows and repaints

### HTML

1. **Semantic Markup**: Use appropriate HTML5 elements
2. **Accessibility**: Include proper ARIA attributes
3. **Validation**: Ensure valid HTML5 markup

## Development Workflow

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Commit your changes
7. Push to your fork
8. Create a pull request

### Branch Naming

- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Documentation branches: `docs/doc-name`

### Commit Messages

Follow the conventional commit format:
- `feat: Add new feature`
- `fix: Fix bug in report generation`
- `docs: Update API documentation`
- `test: Add unit tests for validation functions`
- `refactor: Improve code organization`

## Testing

### Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

### Writing Tests

1. Create test files in the `tests/` directory
2. Use the simple test framework provided in `test-runner.js`
3. Test all critical functions
4. Include edge cases and error conditions

### Test Coverage

Aim for at least 80% test coverage for critical functions.

## Building and Deployment

### Development Server

Start the development server with:
```bash
npm start
```

For a custom port:
```bash
npm run dev
```

### Production Build

The application is a static site that can be deployed to any web server.

### Deployment Options

1. **Static Hosting**: Deploy to services like GitHub Pages, Netlify, or Vercel
2. **Traditional Web Server**: Deploy to Apache or Nginx
3. **Cloud Services**: Deploy to AWS S3, Google Cloud Storage, or Azure Storage

## Contributing

### How to Contribute

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Write tests if applicable
5. Update documentation
6. Commit your changes
7. Push to your fork
8. Create a pull request

### Pull Request Guidelines

1. Include a clear description of the changes
2. Reference any related issues
3. Include screenshots if UI changes are made
4. Ensure all tests pass
5. Follow the coding standards
6. Update documentation as needed

### Code Review Process

All pull requests must be reviewed by at least one other developer before merging.

### Reporting Issues

1. Check if the issue already exists
2. Provide a clear description
3. Include steps to reproduce
4. Include browser and OS information
5. Include screenshots if applicable

## Versioning

This project follows Semantic Versioning (SemVer):

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

## License

This project is licensed under the MIT License. See the LICENSE file for details.