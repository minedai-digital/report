# Development Guide

This guide provides information for developers who want to contribute to or extend the Medical Inspection Reports System.

## Project Structure

```
medical-inspection-reports/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet with responsive design
├── js/
│   ├── main.js         # Main application logic with ES6 modules
│   ├── database.js     # Database module for data handling
│   └── utils.js        # Utility functions for validation, formatting, and security
├── data/
│   └── database.json   # JSON data storage for inspectors, locations, employees, and positions
├── docs/
│   ├── README.md       # Documentation overview
│   ├── user-guide.md   # User guide
│   ├── api.md          # API documentation
│   ├── development.md  # Development guide (this file)
│   ├── architecture.md # Architecture documentation
│   ├── google-sheets-integration.md # Google Sheets integration guide
│   └── backend-setup.md # Backend service setup guide
├── tests/
│   ├── test-runner.js  # Test runner
│   └── utils.test.js   # Unit tests for utility functions
├── backend-example.js  # Example backend service for Google Sheets integration
├── assets/
│   └── fonts/          # Custom fonts (if any)
├── package.json        # Project metadata and dependencies
├── CHANGELOG.md        # Version history
├── LICENSE             # License information
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (usually comes with Node.js)
- A modern web browser for testing
- A code editor (VS Code recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medical-inspection-reports
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For Google Sheets integration, start the backend service:
   ```bash
   npm run backend:dev
   ```

## Code Organization

The application follows a modular architecture:

### Frontend Structure

- **[index.html](../index.html)**: Main HTML file that loads all resources
- **[css/styles.css](../css/styles.css)**: All styling rules with responsive design
- **[js/main.js](../js/main.js)**: Main application logic, including:
  - Form handling
  - Report generation
  - Event listeners
  - Google Sheets integration
- **[js/database.js](../js/database.js)**: Database module for loading and accessing data
- **[js/utils.js](../js/utils.js)**: Utility functions for validation, formatting, and security
- **[data/database.json](../data/database.json)**: JSON data storage

### Backend Structure

- **[backend-example.js](../backend-example.js)**: Example backend service for Google Sheets integration
- **[docs/backend-setup.md](backend-setup.md)**: Detailed setup guide for the backend service

## Development Workflow

### Running the Application

1. **Frontend Development Server**:
   ```bash
   npm run dev
   ```
   This starts a development server on port 3000 with live reloading.

2. **Backend Service**:
   ```bash
   npm run backend:dev
   ```
   This starts the backend service on port 3001 with auto-restart on file changes.

### Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Building for Production

The application is client-side only and doesn't require a build step. Simply deploy the files to a web server.

## Code Standards

### JavaScript

- Use ES6+ features and syntax
- Follow modular architecture with ES6 imports/exports
- Use camelCase for variables and functions
- Use PascalCase for constructors and classes
- Include JSDoc documentation for all functions
- Implement proper error handling with try/catch blocks
- Use descriptive variable and function names

### CSS

- Use CSS variables for consistent theming
- Follow a mobile-first responsive design approach
- Use meaningful class names
- Organize CSS with comments and sections

### HTML

- Use semantic HTML elements
- Include proper ARIA attributes for accessibility
- Maintain proper document structure

## Google Sheets Integration

The application includes Google Sheets integration with the following structure:
```
Date | Time | Inspector | Location | Count absence
```

### Implementation Details

1. **Frontend**: The [sendToGoogleSheets](file:///Users/tarekzhran/Documents/report/js/main.js#L983-L1015) function in [js/main.js](../js/main.js) handles the UI and data collection
2. **Backend**: The [backend-example.js](../backend-example.js) file provides a Node.js service for secure Google Sheets API calls
3. **Security**: All API credentials are handled server-side to prevent exposure

For detailed setup instructions, see:
- [Google Sheets Integration Guide](google-sheets-integration.md)
- [Backend Service Setup Guide](backend-setup.md)

## Adding New Features

### Adding New Data Fields

1. Update [data/database.json](../data/database.json) with new data
2. Modify [js/database.js](../js/database.js) to expose new data access functions
3. Update the UI in [index.html](../index.html) to include new form fields
4. Modify [js/main.js](../js/main.js) to handle new data in form collection and report generation

### Adding New Utility Functions

1. Add new functions to [js/utils.js](../js/utils.js)
2. Include comprehensive JSDoc documentation
3. Add unit tests in [tests/utils.test.js](../tests/utils.test.js)
4. Export the new functions in the export section

### Adding New Report Sections

1. Modify the report generation functions in [js/main.js](../js/main.js)
2. Update the CSS in [css/styles.css](../css/styles.css) for new styling
3. Add new data collection logic if needed

## Testing

### Unit Tests

Unit tests are located in the [tests/](../tests/) directory:

- [test-runner.js](../tests/test-runner.js): Main test runner
- [utils.test.js](../tests/utils.test.js): Tests for utility functions

Run tests with:
```bash
npm test
```

### Manual Testing

1. Test all form fields and validation
2. Test report generation with various data combinations
3. Test Google Sheets integration
4. Test print functionality
5. Test responsive design on different screen sizes
6. Test keyboard shortcuts
7. Test accessibility features

## Deployment

### Static Deployment

The application can be deployed to any static web hosting service:

1. GitHub Pages
2. Netlify
3. Vercel
4. Any traditional web server

Simply upload all files to your hosting provider.

### Backend Deployment

For Google Sheets integration, deploy the backend service:

1. Update configuration for production environment
2. Deploy to a cloud platform (Heroku, AWS, Google Cloud, etc.)
3. Update the frontend API URL to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Code Quality

### Documentation

- All functions should include JSDoc comments
- Complex logic should be explained with inline comments
- Public APIs should be documented in [api.md](api.md)
- User-facing features should be documented in [user-guide.md](user-guide.md)

### Error Handling

- All async functions should use try/catch blocks
- User-friendly error messages should be displayed
- Console logging should be used for debugging
- Errors should be handled gracefully without crashing the application

### Performance

- Minimize DOM manipulation
- Use efficient algorithms
- Implement proper event listener cleanup
- Optimize images and assets

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure `type: "module"` is in package.json
2. **CORS errors**: Make sure the backend service includes proper CORS headers
3. **Google Sheets errors**: Verify service account permissions and spreadsheet ID
4. **Styling issues**: Check browser compatibility and CSS prefixes

### Debugging Tips

1. Use browser developer tools to inspect elements and network requests
2. Check the console for JavaScript errors
3. Use console.log statements for debugging complex logic
4. Test in multiple browsers to ensure compatibility

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.