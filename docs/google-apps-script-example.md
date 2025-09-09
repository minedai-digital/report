# Google Apps Script Alternative

This guide explains how to use Google Apps Script as an alternative to setting up a backend service for Google Sheets integration.

## Why Use Google Apps Script?

Google Apps Script is a simpler alternative to a full backend service because:
- No need to set up a separate server
- No need to manage credentials in environment variables
- Runs directly within Google's infrastructure
- Easier to set up for non-developers

## Setting Up Google Apps Script

### Step 1: Open Your Google Sheet

1. Open your Google Sheet with the column structure:
   ```
   Date | Time | Inspector | Location | Count absence
   ```

### Step 2: Access Google Apps Script

1. In your Google Sheet, go to `Extensions` > `Apps Script`
2. If you see default code, delete it all
3. Replace it with the following code:

```javascript
/**
 * Google Apps Script for Medical Inspection Reports
 * This script handles POST requests from the web application
 */

// CORS headers for web requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

/**
 * Handle POST requests to add data to the spreadsheet
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Time', 'Inspector', 'Location', 'Count absence']);
    }
    
    // Prepare the data row in the correct order
    const rowData = [
      data.date || '',
      data.time || '',
      data.inspector || '',
      data.location || '',
      data.countAbsence || 0
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data added to spreadsheet successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error adding data to spreadsheet',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
  }
}

/**
 * Handle GET requests for health check
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Apps Script is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders(CORS_HEADERS);
}
```

### Step 3: Deploy as Web App

If you haven't already deployed your script, follow these steps:

1. Click the "Deploy" button (cloud icon) in the Apps Script editor
2. Select "New deployment"
3. Under "Select type", choose "Web app"
4. Set the following options:
   - **Description**: Medical Inspection Reports API
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with Google" for more security)
5. Click "Deploy"
6. In the dialog that appears, click "Authorize access"
7. Select your Google account if prompted
8. Review and accept the permissions

**Note**: You've already deployed your script at this URL:
```
https://script.google.com/macros/s/AKfycbxB35hGWqq-ah6ixWs19IMhYcBMAETRFBpUdZ_1b7Fr1A9fz4SJkI5EoxqBMt7uLsSW/exec
```

### Step 4: Update Frontend Code

The application is already configured to use your web app URL. The [sendToRealGoogleSheets](file:///Users/tarekzhran/Documents/report/js/main.js#L1003-L1037) function in [js/main.js](../js/main.js) has been updated to use:
```
https://script.google.com/macros/s/AKfycbxB35hGWqq-ah6ixWs19IMhYcBMAETRFBpUdZ_1b7Fr1A9fz4SJkI5EoxqBMt7uLsSW/exec
```

### Step 5: Test the Integration

1. Open your Medical Inspection Reports application
2. Generate a report by filling in the form and clicking "إنشاء التقرير"
3. Click "إرسال لجوجل شيتس"
4. Check your Google Sheet to see if the data was added

## Security Considerations

When using Google Apps Script with "Anyone" access:

1. **Rate Limiting**: Google Apps Script has quotas and limits
2. **Data Validation**: The script includes basic validation, but you might want to add more
3. **Access Control**: Consider using "Anyone with Google" instead of "Anyone" for better security
4. **Error Handling**: The script includes error handling, but monitor for any issues

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Apps Script includes the CORS headers
2. **Authorization Errors**: Check that you've properly authorized the web app
3. **Data Not Appearing**: Verify the column structure matches exactly
4. **Timeout Errors**: Google Apps Script has execution time limits

### Debugging Tips

1. Check the Apps Script execution logs:
   - In the Apps Script editor, go to "View" > "Logs"
   - Or go to "Executions" tab to see recent runs

2. Test the web app URL directly in your browser:
   - You should see the health check response

3. Check your browser's developer console for network errors

4. Verify your Google Sheet sharing settings

## Limitations

Google Apps Script has some limitations compared to a full backend service:

1. **Execution Time**: Limited to 6 minutes per execution
2. **Quotas**: Daily quotas for URL fetch calls and other services
3. **Scalability**: Not suitable for high-volume applications
4. **Error Handling**: Limited compared to full backend services
5. **Security**: Less control over authentication and authorization

## When to Use Each Approach

### Use Google Apps Script When:
- You want a quick and simple solution
- You don't have server infrastructure
- You're not expecting high traffic
- You're comfortable with Google's quotas and limitations

### Use a Backend Service When:
- You need more control over the integration
- You expect high traffic
- You need advanced error handling
- You want better security controls
- You're already running other backend services

## Example Usage

Here's a complete example of how the integration works:

1. User fills out the form in your application
2. User clicks "إرسال لجوجل شيتس"
3. Your frontend sends a POST request to your Google Apps Script web app
4. Google Apps Script receives the data and adds it to your Google Sheet
5. Your frontend receives a success response and shows a confirmation message

The data will appear in your Google Sheet in the correct column order:
```
Date | Time | Inspector | Location | Count absence
```

## Updating the Script

If you need to modify the Google Apps Script:

1. Go to `Extensions` > `Apps Script` in your Google Sheet
2. Make your changes to the code
3. Click "Deploy" > "Manage deployments"
4. Click the edit icon (pencil)
5. Select "New version"
6. Click "Deploy"
7. The URL will remain the same, so no frontend changes are needed

This approach provides a simpler alternative to setting up a full backend service while still allowing your application to send data to Google Sheets.