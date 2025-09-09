# Medical Inspection Reports System

A professional web-based application for creating and printing medical inspection reports for hospitals and health centers in Arabic.

## Features

- Professional report generation with customizable templates
- Auto-complete system for inspectors, locations, and employees
- Print-ready report formatting
- Data export to Google Sheets (simulated)
- Responsive Arabic user interface
- Real-time form validation
- Keyboard shortcuts for enhanced productivity
- Advanced security features to prevent XSS attacks
- Comprehensive error handling and user feedback
- Performance optimized for fast loading and smooth operation
- PDF export functionality
- Comprehensive documentation

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
│   ├── development.md  # Development guide
│   └── architecture.md # Architecture documentation
├── tests/
│   ├── test-runner.js  # Test runner
│   └── utils.test.js   # Unit tests for utility functions
├── assets/
│   └── fonts/          # Custom fonts (if any)
├── package.json        # Project metadata and dependencies
├── CHANGELOG.md        # Version history
├── LICENSE             # License information
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge)
- Node.js (optional, for development server)

### Installation

1. Clone or download the repository
2. Open `index.html` in your browser directly, or
3. Run a local development server:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or start development server on port 3000
npm run dev
```

### Alternative Installation (without Node.js)

If you don't have Node.js installed, you can use Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd medical-inspection-reports

# Start Python HTTP server (Python 3)
python3 -m http.server 8000

# Or for Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to `http://localhost:8000`

## Usage

1. Open the application in your browser
2. Fill in the report details (inspector name, location, date, time)
3. Add absence cases if any
4. Click "Generate Report"
5. Print the report, export as PDF, or send data to Google Sheets

## Keyboard Shortcuts

- `Ctrl + S` - Generate report
- `Ctrl + P` - Print report
- `Ctrl + N` - Clear form
- `F5` - Refresh page (with confirmation)

## Technical Details

### Technologies Used

- HTML5 with semantic markup
- CSS3 (with Flexbox and Grid) for responsive design
- JavaScript (ES6+) with modular architecture
- Google Fonts (Noto Sans Arabic) for Arabic text rendering
- Font Awesome Icons for UI elements

### Code Organization

The application follows a modular approach with clear separation of concerns:
- **UI Components**: Form elements, report preview, modals, and loading overlays
- **Data Management**: Form validation, data collection, and state management
- **Business Logic**: Report generation, date formatting, and data processing
- **Utilities**: Helper functions for validation, formatting, security, and DOM manipulation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Database**: Separate JSON file for data storage with dedicated module

### Security Features

- XSS prevention through HTML escaping
- Input validation and sanitization
- Secure data handling practices
- Error handling and user feedback without exposing system details

### Performance Optimizations

- Efficient DOM manipulation with minimal reflows
- Lazy loading of non-critical resources
- Optimized event handling with proper cleanup
- Memory management to prevent leaks

## Development

### Code Standards

- Consistent naming conventions following camelCase for variables and PascalCase for constructors
- Comprehensive JSDoc documentation for all functions
- Error handling in all functions with try/catch blocks
- Responsive design principles with mobile-first approach
- Accessibility considerations with proper ARIA attributes
- Modular architecture with ES6 imports/exports

### Testing

Unit tests are located in the `tests/` directory and can be run with:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

### Documentation

Comprehensive documentation is available in the `docs/` directory:
- [User Guide](docs/user-guide.md) - Instructions for end users
- [API Documentation](docs/api.md) - Technical documentation for developers
- [Development Guide](docs/development.md) - Guidelines for contributing to the project
- [Architecture](docs/architecture.md) - System architecture and design decisions

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## API Documentation

### Main Functions

- `generateReport()` - Generates the medical inspection report
- `printReport()` - Prints the generated report
- `exportReportAsPDF()` - Exports the report as PDF
- `sendToGoogleSheets()` - Sends data to Google Sheets (simulated)
- `clearForm()` - Clears all form data
- `addAbsenceRow()` - Adds a new absence row to the form
- `removeAbsenceRow(btn)` - Removes an absence row from the form

### Utility Functions

- `formatDate(dateString)` - Formats dates in Arabic
- `formatTime(timeString)` - Formats time values
- `escapeHtml(text)` - Prevents XSS attacks
- `validateForm()` - Validates form data
- `showStatus(message, type)` - Displays status messages
- `showLoading(show, message)` - Shows/hides loading overlay

### Database Functions

- `loadDatabase()` - Loads the database from JSON file
- `getInspectors()` - Gets list of inspectors
- `getLocations()` - Gets list of locations
- `getEmployees()` - Gets list of employees
- `getPositions()` - Gets list of positions

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Developed by Tarek Zhran

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.