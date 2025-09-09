# Backend Service Setup Guide

This guide explains how to set up the backend service for Google Sheets integration.

## Prerequisites

1. Node.js installed on your system
2. A Google Cloud account
3. A Google Sheet with the following column structure:
   ```
   Date | Time | Inspector | Location | Count absence
   ```

## Step-by-Step Setup

### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

This will install:
- express: Web framework for Node.js
- cors: Cross-Origin Resource Sharing middleware
- googleapis: Google APIs client library

### 2. Set Up Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Enter a name for your service account (e.g., "medical-reports")
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"
5. Create and download a key for your service account:
   - Click on your service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" and click "Create"
   - Save the downloaded file (e.g., as `service-account-key.json`)

### 3. Share Your Google Sheet

1. Open your Google Sheet
2. Click the "Share" button
3. Add the email address from your service account JSON file (it looks like `your-service-account@your-project.iam.gserviceaccount.com`)
4. Give it "Editor" permissions

### 4. Configure the Backend Service

You need to update the configuration in [backend-example.js](../backend-example.js):

1. Get your Google Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the long string between `/d/` and `/edit`

2. Update the configuration in [backend-example.js](../backend-example.js):
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual ID
   ```

3. Configure your service account credentials. You have three options:

   **Option A: Environment Variables (Recommended)**
   Set these environment variables:
   ```bash
   export GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   ```

   **Option B: JSON File**
   Save your service account key as `service-account-key.json` and uncomment these lines:
   ```javascript
   const credentials = require('./service-account-key.json');
   ```

   **Option C: Direct Configuration (Not recommended for production)**
   Update these values directly in the code:
   ```javascript
   const credentials = {
     client_email: 'your-service-account@your-project.iam.gserviceaccount.com',
     private_key: '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n'
   };
   ```

### 5. Run the Backend Service

You can run the backend service in different modes:

**Development mode (with auto-restart on file changes):**
```bash
npm run backend:dev
```

**Production mode:**
```bash
npm run backend
```

**Or directly with Node.js:**
```bash
node backend-example.js
```

The service will start on port 3001 by default.

### 6. Test the Backend Service

1. Check if the service is running:
   ```
   curl http://localhost:3001/api/health
   ```

2. You should see a response like:
   ```json
   {
     "status": "OK",
     "message": "Google Sheets integration service is running"
   }
   ```

### 7. Update Frontend Code

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

### 8. Run Your Complete Application

1. Start the backend service: `npm run backend`
2. Start the frontend: `npm start`
3. Open your browser and navigate to `http://localhost:3000`
4. Generate a report and click "إرسال لجوجل شيتس"

## Troubleshooting

### Common Issues

1. **Authentication errors:**
   - Make sure your service account has editor access to the Google Sheet
   - Verify that your private key is correctly formatted (mind the `\n` characters)
   - Check that your spreadsheet ID is correct

2. **CORS errors:**
   - The backend service includes CORS middleware to handle this
   - Make sure you're using the correct URLs

3. **Network errors:**
   - Ensure both the frontend and backend services are running
   - Check your firewall settings

4. **Data not appearing in Google Sheets:**
   - Check the backend service logs for errors
   - Verify the column structure matches exactly:
     ```
     Date | Time | Inspector | Location | Count absence
     ```

### Debugging Tips

1. Check the backend service console for error messages
2. Use browser developer tools to inspect network requests
3. Add console.log statements to track data flow
4. Verify your Google Cloud project settings

## Security Considerations

1. Never commit your service account key to version control
2. Use environment variables for sensitive information
3. Implement proper authentication for production use
4. Consider adding rate limiting to prevent abuse
5. Use HTTPS in production environments

## Production Deployment

For production deployment, consider:

1. Using environment variables for all configuration
2. Implementing proper authentication and authorization
3. Adding logging and monitoring
4. Using a process manager like PM2
5. Deploying to a cloud platform (Heroku, AWS, Google Cloud, etc.)
6. Using HTTPS with a reverse proxy like Nginx

## API Endpoints

The backend service provides the following endpoints:

### `GET /api/health`
Health check endpoint to verify the service is running.

### `POST /api/send-to-sheets`
Sends data to Google Sheets.

**Request Body:**
```json
{
  "date": "2023-01-01",
  "time": "12:30",
  "inspector": "Inspector Name",
  "location": "Location Name",
  "countAbsence": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data sent to Google Sheets successfully",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID"
}
```

### `GET /api/get-recent-entries`
Retrieves the last 10 entries from Google Sheets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Date": "2023-01-01",
      "Time": "12:30",
      "Inspector": "Inspector Name",
      "Location": "Location Name",
      "Count absence": "5"
    }
  ],
  "message": "Retrieved 1 entries"
}
```