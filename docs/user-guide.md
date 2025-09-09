# User Guide: Medical Inspection Reports System

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Getting Started](#getting-started)
4. [Creating a Report](#creating-a-report)
5. [Adding Absence Cases](#adding-absence-cases)
6. [Generating and Printing Reports](#generating-and-printing-reports)
7. [Exporting Data](#exporting-data)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

## Introduction

The Medical Inspection Reports System is a professional web-based application designed for creating and printing medical inspection reports for hospitals and health centers. This system helps medical inspectors efficiently document their visits and any findings during inspections.

## System Requirements

### Browser Requirements
- Google Chrome (latest 2 versions)
- Mozilla Firefox (latest 2 versions)
- Microsoft Edge (latest 2 versions)
- Safari (latest 2 versions)

### Technical Requirements
- Modern web browser with JavaScript enabled
- Internet connection (for initial loading of resources)
- Printer (for printing reports)

## Getting Started

1. Open your web browser
2. Navigate to the application by opening the `index.html` file
3. The application will load automatically with today's date and time pre-filled

## Creating a Report

### Step 1: Fill in Basic Information

1. **Inspector Name**: Enter the name of the inspector conducting the visit
   - Use the autocomplete feature by typing part of the name
   - Select from the suggested names that appear

2. **Location**: Enter the name of the hospital or health center
   - Use the autocomplete feature for predefined locations
   - You can also enter a custom location name

3. **Date**: The current date is pre-filled
   - You can change the date using the date picker
   - Dates cannot be in the future or more than one year in the past

4. **Time**: The current time is pre-filled
   - You can change the time using the time picker

### Step 2: Add Absence Cases (Optional)

If there are absence cases to report:

1. Click the "إضافة حالة غياب" button
2. Fill in the employee name and position
3. Repeat for additional absence cases
4. Remove any unnecessary rows using the trash icon

## Adding Absence Cases

### Adding a New Absence Row
- Click the "إضافة حالة غياب" button in the absence section
- A new row will appear with fields for employee name and position

### Filling Employee Information
1. **Employee Name**: 
   - Type the employee name
   - Use autocomplete suggestions when available
   - The position field will auto-fill with a random position when you enter a name

2. **Position**: 
   - Select from predefined positions
   - You can also enter a custom position

### Removing Absence Rows
- Click the trash icon (🗑️) next to any absence row to remove it
- Confirm the deletion when prompted

## Generating and Printing Reports

### Generating a Report
1. Fill in all required information
2. Click the "إنشاء التقرير" button
3. The system will validate your input
4. If valid, the report will be generated and displayed

### Printing a Report
1. After generating a report, the "طباعة التقرير" button will become active
2. Click the "طباعة التقرير" button
3. Use your browser's print dialog to print or save as PDF

### Clearing the Form
- Click the "مسح النموذج" button to clear all data
- Confirm when prompted to prevent accidental data loss

## Exporting Data

### Sending to Google Sheets
1. After generating a report, the "إرسال لجوجل شيتس" button will become active
2. Click the button to simulate sending data to Google Sheets
3. The system prevents duplicate submissions of the same report

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + S | Generate report |
| Ctrl + P | Print report |
| Ctrl + N | Clear form |
| F5 | Refresh page (with confirmation) |
| ↑/↓ | Navigate autocomplete suggestions |
| Enter | Select autocomplete suggestion |
| Esc | Close autocomplete suggestions |

## Troubleshooting

### Common Issues and Solutions

#### Report Not Generating
- Ensure all required fields are filled
- Check that the date is not in the future
- Verify that there are no special characters causing issues

#### Autocomplete Not Working
- Make sure you're typing at least one character
- Check that JavaScript is enabled in your browser
- Refresh the page if the issue persists

#### Printing Issues
- Ensure your printer is properly connected
- Check browser print settings
- Try printing to PDF first to test

#### Slow Performance
- Close other browser tabs
- Refresh the page
- Check your internet connection

### Error Messages

#### "يرجى إدخال اسم القائم بالمرور"
- Solution: Fill in the inspector name field

#### "يرجى إدخال اسم الجهة"
- Solution: Fill in the location field

#### "يرجى إدخال تاريخ المرور"
- Solution: Select a valid date

#### "يرجى إدخال وقت المرور"
- Solution: Select a valid time

#### "لا يمكن أن يكون تاريخ المرور في المستقبل"
- Solution: Select today's date or a past date

#### "تاريخ المرور قديم جداً"
- Solution: Select a date within the last year

## FAQ

### Q: Can I save reports for later?
A: Reports are generated in real-time and can be printed or saved as PDF. The system does not currently store reports locally.

### Q: How do I add a new inspector name?
A: Type the new name directly in the inspector field. The autocomplete feature will suggest existing names, but you can enter new ones.

### Q: Can I use this system offline?
A: Once loaded, the system can function offline for basic report generation, but some features like font loading may require an internet connection initially.

### Q: Is my data stored anywhere?
A: No personal data is stored by the system. All data remains in your browser and is cleared when you close the page.

### Q: How do I update the list of locations or employees?
A: The predefined lists are built into the system. For custom entries, you can type directly into the fields.

### Q: What browsers are supported?
A: The system works best on modern browsers including Chrome, Firefox, Edge, and Safari.

### Q: Can I customize the report format?
A: The current version uses a standardized format. Customization options may be available in future versions.

## Support

For technical support or feature requests, please contact the system administrator or developer.

## Version Information

Current Version: 1.0.0
Last Updated: 2025
Developed by: Tarek Zhran