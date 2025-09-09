/**
 * Example backend service for Google Sheets integration
 * 
 * This is a simple Node.js server that handles Google Sheets API calls.
 * 
 * To use this:
 * 1. Install dependencies: npm install express cors googleapis
 * 2. Set up your Google Cloud project and service account
 * 3. Update the configuration variables below
 * 4. Run: node backend-example.js
 */

const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TODO: Update these with your actual values
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Get this from your Google Sheet URL
const PORT = process.env.PORT || 3001;

// TODO: Add your service account credentials
// You can either:
// 1. Load from a JSON file: const credentials = require('./service-account-key.json');
// 2. Set as environment variables
// 3. Add directly here (NOT recommended for production)

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL || 'your-service-account-email@your-project.iam.gserviceaccount.com',
  private_key: process.env.GOOGLE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n'
};

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Google Sheets integration service is running' });
});

/**
 * Endpoint to send data to Google Sheets
 * Expected data format:
 * {
 *   "date": "2023-01-01",
 *   "time": "12:30",
 *   "inspector": "Inspector Name",
 *   "location": "Location Name",
 *   "countAbsence": 5
 * }
 */
app.post('/api/send-to-sheets', async (req, res) => {
  try {
    const { date, time, inspector, location, countAbsence } = req.body;

    // Validate required fields
    if (!date || !time || !inspector || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: date, time, inspector, and location are required' 
      });
    }

    // Prepare data row according to your structure:
    // Date | Time | Inspector | Location | Count absence
    const rowData = [date, time, inspector, location, countAbsence || 0];

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', // Adjust sheet name if needed
      valueInputOption: 'RAW',
      resource: {
        values: [rowData],
      },
    });

    console.log('Data sent to Google Sheets:', {
      date,
      time,
      inspector,
      location,
      countAbsence
    });

    res.json({ 
      success: true, 
      message: 'Data sent to Google Sheets successfully',
      sheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
    });
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send data to Google Sheets',
      error: error.message 
    });
  }
});

/**
 * Endpoint to get the last 10 entries from Google Sheets
 */
app.get('/api/get-recent-entries', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:E10', // Get first 10 rows
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json({ success: true, data: [], message: 'No data found' });
    }

    // Convert to objects with proper column names
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    res.json({ 
      success: true, 
      data: data,
      message: `Retrieved ${data.length} entries`
    });
  } catch (error) {
    console.error('Error retrieving data from Google Sheets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve data from Google Sheets',
      error: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Google Sheets integration server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Send data endpoint: http://localhost:${PORT}/api/send-to-sheets`);
});

module.exports = app;