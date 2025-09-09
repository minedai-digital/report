# Google Sheets Integration Guide

This guide explains how to connect the Medical Inspection Reports System to Google Sheets with your specific column structure.

## Your Google Sheet Structure

Your Google Sheet has the following columns in this exact order:
```
Date | Time | Inspector | Location | Count absence
```

## Setting Up Google Sheets Integration

### Step 1: Prepare Your Google Sheet

1. Open your Google Sheet
2. Make sure your columns are in this exact order:
   - Column A: Date
   - Column B: Time
   - Column C: Inspector
   - Column D: Location
   - Column E: Count absence

### Step 2: Set Up Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Follow the prompts to create a service account
   - Download the JSON key file

### Step 3: Share Your Google Sheet

1. Open your Google Sheet
2. Click the "Share" button
3. Add the email address from your service account JSON file
4. Give it "Editor" permissions

### Step 4: Set Up the Backend Service

For detailed instructions on setting up the backend service, see [Backend Service Setup Guide](backend-setup.md).

The backend service handles the Google Sheets API calls securely, preventing exposure of your credentials in the frontend code.

### Step 5: Update Frontend Code

Update the [sendToRealGoogleSheets](file:///Users/tarekzhran/Documents/report/js/main.js#L1003-L1029) function in [js/main.js](file:///Users/tarekzhran/Documents/report/js/main.js) to send data to your backend service:

```javascript
/**
 * Sends data to a real Google Sheet using the Google Sheets API
 * @param {Object} data - Data to send
 * @returns {Promise} Promise that resolves after sending data
 */
async function sendToRealGoogleSheets(data) {
    const response = await fetch('http://localhost:3001/api/send-to-sheets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Format data according to your Google Sheet structure:
            date: data.date || '',
            time: data.time || '',
            inspector: data.inspectorName || '',
            location: data.location || '',
            countAbsence: Array.isArray(data.absences) ? data.absences.length : 0
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send data to Google Sheets');
    }
    
    return await response.json();
}
```

### Step 6: Run Your Application

1. Start your backend service: `npm run backend`
2. Start your frontend: `npm start`
3. Open your browser and navigate to `http://localhost:3000`
4. Generate a report and click "إرسال لجوجل شيتس"

## Security Considerations

1. Never expose your service account credentials in frontend code
2. Always use a backend service to handle API calls
3. Use environment variables for sensitive information
4. Implement proper authentication for your backend service

## Troubleshooting

If you encounter issues:

1. Check that your service account has editor access to the Google Sheet
2. Verify the spreadsheet ID is correct
3. Ensure your backend service is running
4. Check browser console for any error messages
5. Verify your internet connection

## Alternative: Google Apps Script

If you prefer a simpler solution without a backend server, you can use Google Apps Script:

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Replace the default code with:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Add headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Time', 'Inspector', 'Location', 'Count absence']);
  }
  
  // Add data row
  sheet.appendRow([
    data.date,
    data.time,
    data.inspector,
    data.location,
    data.countAbsence
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone" (or "Anyone with Google" for more security)
   - Copy the web app URL

5. Update the frontend code to send data to this URL.