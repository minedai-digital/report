# API Documentation

This document provides technical documentation for the Medical Inspection Reports System API.

## Table of Contents

1. [Main Application Module](#main-application-module)
2. [Utility Functions Module](#utility-functions-module)
3. [Data Structures](#data-structures)
4. [Error Handling](#error-handling)

## Main Application Module

### Functions

#### `generateReport()`
Generates a medical inspection report based on form data.

**Parameters:** None

**Returns:** None

**Description:** 
Collects data from the form, validates it, and generates an HTML report. The report is displayed in the preview area.

#### `printReport()`
Prints the currently generated report.

**Parameters:** None

**Returns:** None

**Description:** 
Hides UI elements and triggers the browser's print functionality.

#### `exportReportAsPDF()`
Exports the report as a PDF file.

**Parameters:** None

**Returns:** None

**Description:** 
Triggers the print functionality which allows saving as PDF.

#### `sendToGoogleSheets()`
Sends report data to Google Sheets (simulated).

**Parameters:** None

**Returns:** None

**Description:** 
Collects form data and sends it to a simulated Google Sheets API.

#### `clearForm()`
Clears all form data.

**Parameters:** None

**Returns:** None

**Description:** 
Resets the form and clears all input fields.

#### `addAbsenceRow()`
Adds a new absence row to the form.

**Parameters:** None

**Returns:** None

**Description:** 
Creates a new row for entering absence information.

#### `removeAbsenceRow(btn)`
Removes an absence row from the form.

**Parameters:** 
- `btn` (HTMLElement): The delete button that was clicked

**Returns:** None

#### `selectSuggestion(inputId, value)`
Selects a suggestion from the autocomplete list.

**Parameters:** 
- `inputId` (string): ID of the input element
- `value` (string): Value to set in the input

**Returns:** None

#### `validateForm()`
Validates the main form.

**Parameters:** None

**Returns:** boolean - True if form is valid, false otherwise

#### `collectFormData()`
Collects main form data.

**Parameters:** None

**Returns:** Object - Form data

#### `collectAbsenceData()`
Collects absence data from form fields.

**Parameters:** None

**Returns:** Array - Array of absence records

#### `generateReportHTML(data)`
Generates the complete report HTML.

**Parameters:** 
- `data` (Object): Report data

**Returns:** string - Complete report HTML

#### `generateAbsenceTable(absences)`
Generates the absence table HTML.

**Parameters:** 
- `absences` (Array): Array of absence records

**Returns:** string - HTML for the absence table

#### `setupAutoComplete(inputId, suggestionsId, dataArray)`
Sets up autocomplete functionality for input fields.

**Parameters:** 
- `inputId` (string): ID of the input element
- `suggestionsId` (string): ID of the suggestions container
- `dataArray` (Array): Array of data for autocomplete

**Returns:** None

#### `setupEmployeeAutoComplete(nameInputId, positionInputId)`
Sets up employee autocomplete with position auto-fill.

**Parameters:** 
- `nameInputId` (string): ID of the employee name input
- `positionInputId` (string): ID of the position select

**Returns:** None

#### `updateRowNumbers()`
Updates row numbers after adding/removing rows.

**Parameters:** None

**Returns:** None

#### `initializeApp()`
Initializes the application when the DOM is loaded.

**Parameters:** None

**Returns:** None

## Utility Functions Module

### Constants

#### `MONTHS`
Array of Arabic month names.

**Type:** Array<string>

#### `DAYS`
Array of Arabic day names.

**Type:** Array<string>

### Validation Functions

#### `isValidString(str)`
Validates that a string is not empty and contains valid characters.

**Parameters:** 
- `str` (string): The string to validate

**Returns:** boolean - True if the string is valid, false otherwise

#### `isValidDate(dateString)`
Validates a date string.

**Parameters:** 
- `dateString` (string): Date in YYYY-MM-DD format

**Returns:** boolean - True if the date is valid, false otherwise

#### `isValidTime(timeString)`
Validates a time string.

**Parameters:** 
- `timeString` (string): Time in HH:MM format

**Returns:** boolean - True if the time is valid, false otherwise

#### `isValidEmail(email)`
Validates an email address.

**Parameters:** 
- `email` (string): Email address to validate

**Returns:** boolean - True if the email is valid, false otherwise

#### `isValidPhone(phone)`
Validates a phone number.

**Parameters:** 
- `phone` (string): Phone number to validate

**Returns:** boolean - True if the phone number is valid, false otherwise

### Formatting Functions

#### `formatDate(dateString)`
Formats a date string into Arabic format.

**Parameters:** 
- `dateString` (string): Date in YYYY-MM-DD format

**Returns:** string - Formatted date in Arabic

#### `formatTime(timeString)`
Formats a time string.

**Parameters:** 
- `timeString` (string): Time in HH:MM format

**Returns:** string - Formatted time

#### `formatNumber(num)`
Formats a number with commas.

**Parameters:** 
- `num` (number): Number to format

**Returns:** string - Formatted number with commas

#### `truncateString(str, maxLength, suffix)`
Truncates a string to a specified length.

**Parameters:** 
- `str` (string): String to truncate
- `maxLength` (number): Maximum length of the string
- `suffix` (string): Suffix to append if truncated

**Returns:** string - Truncated string

### Security Functions

#### `escapeHtml(text)`
Escapes HTML characters to prevent XSS attacks.

**Parameters:** 
- `text` (string): Text to escape

**Returns:** string - Escaped text

#### `sanitizeInput(input)`
Sanitizes user input by removing potentially dangerous characters.

**Parameters:** 
- `input` (string): User input to sanitize

**Returns:** string - Sanitized input

#### `generateReportId(data)`
Generates a unique report ID based on report data.

**Parameters:** 
- `data` (Object): Report data

**Returns:** string - Unique report ID

### DOM Utility Functions

#### `showLoading(show, message)`
Shows a loading overlay with optional message.

**Parameters:** 
- `show` (boolean): Whether to show or hide the overlay (default: true)
- `message` (string): Optional message to display (default: 'جاري المعالجة...')

**Returns:** None

#### `hideLoading()`
Hides the loading overlay.

**Parameters:** None

**Returns:** None

#### `showStatus(message, type)`
Shows a status message to the user.

**Parameters:** 
- `message` (string): Message to display
- `type` (string): Type of message ('success' or 'error')

**Returns:** None

#### `scrollToElement(elementId, options)`
Scrolls to an element with smooth animation.

**Parameters:** 
- `elementId` (string): ID of the element to scroll to
- `options` (Object): Scroll options

**Returns:** None

#### `addClass(elementId, className)`
Adds a CSS class to an element.

**Parameters:** 
- `elementId` (string): ID of the element
- `className` (string): CSS class to add

**Returns:** None

#### `removeClass(elementId, className)`
Removes a CSS class from an element.

**Parameters:** 
- `elementId` (string): ID of the element
- `className` (string): CSS class to remove

**Returns:** None

## Data Structures

### Report Data Structure
```javascript
{
  inspectorName: string,
  location: string,
  date: string, // YYYY-MM-DD format
  time: string, // HH:MM format
  absences: [
    {
      id: number,
      name: string,
      position: string
    }
  ]
}
```

### Absence Record Structure
```javascript
{
  id: number,
  name: string,
  position: string
}
```

## Error Handling

All functions include comprehensive error handling with try/catch blocks. Errors are logged to the console and appropriate user feedback is provided through the status message system.

### Common Error Messages

- "حدث خطأ في جمع بيانات الغياب. يرجى المحاولة مرة أخرى." (Error collecting absence data)
- "حدث خطأ في جمع بيانات النموذج. يرجى المحاولة مرة أخرى." (Error collecting form data)
- "حدث خطأ في إنشاء جدول الغياب. يرجى المحاولة مرة أخرى." (Error generating absence table)
- "حدث خطأ في إنشاء التقرير. يرجى المحاولة مرة أخرى." (Error generating report)
- "حدث خطأ في إعداد نظام الإكمال التلقائي. يرجى المحاولة مرة أخرى." (Error setting up autocomplete)
- "حدث خطأ في اختيار الاقتراح. يرجى المحاولة مرة أخرى." (Error selecting suggestion)
- "حدث خطأ في إضافة صف الغياب. يرجى المحاولة مرة أخرى." (Error adding absence row)
- "حدث خطأ في حذف صف الغياب. يرجى المحاولة مرة أخرى." (Error removing absence row)
- "حدث خطأ في الطباعة. يرجى المحاولة مرة أخرى." (Error printing report)
- "حدث خطأ في التحقق من صحة البيانات. يرجى المحاولة مرة أخرى." (Error validating form)
- "حدث خطأ في مسح النموذج. يرجى المحاولة مرة أخرى." (Error clearing form)
- "حدث خطأ في إرسال البيانات. يرجى المحاولة مرة أخرى." (Error sending data)
- "حدث خطأ في تهيئة التطبيق. يرجى إعادة تحميل الصفحة." (Error initializing application)
- "حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة." (Unexpected error)