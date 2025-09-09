/**
 * Database module for the Medical Inspection Reports System
 * 
 * This module handles loading and accessing the application's data
 * from the database.json file.
 * 
 * @author Tarek Zhran
 * @version 1.0.0
 */

// =============================================================================
// Database State
// =============================================================================

let database = null;
let isDatabaseLoaded = false;

// =============================================================================
// Database Loading Functions
// =============================================================================

/**
 * Loads the database from the JSON file
 * @returns {Promise<Object>} Promise that resolves to the loaded database
 */
async function loadDatabase() {
    try {
        if (isDatabaseLoaded && database) {
            return database;
        }
        
        // In a browser environment, we need to fetch the JSON file
        const response = await fetch('./data/database.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load database: ${response.status} ${response.statusText}`);
        }
        
        database = await response.json();
        isDatabaseLoaded = true;
        
        console.log('Database loaded successfully');
        return database;
    } catch (error) {
        console.error('Error loading database:', error);
        throw new Error('Failed to load application database');
    }
}

/**
 * Gets the database synchronously (if already loaded)
 * @returns {Object|null} The database object or null if not loaded
 */
function getDatabase() {
    return database;
}

/**
 * Gets inspectors from the database
 * @returns {Array<string>} Array of inspector names
 */
function getInspectors() {
    if (!database) return [];
    return database.inspectors || [];
}

/**
 * Gets locations from the database
 * @returns {Array<string>} Array of location names
 */
function getLocations() {
    if (!database) return [];
    return database.locations || [];
}

/**
 * Gets employees from the database
 * @returns {Array<string>} Array of employee names
 */
function getEmployees() {
    if (!database) return [];
    return database.employees || [];
}

/**
 * Gets positions from the database
 * @returns {Array<string>} Array of job positions
 */
function getPositions() {
    if (!database) return [];
    return database.positions || [];
}

// =============================================================================
// Export Functions
// =============================================================================

export {
    loadDatabase,
    getDatabase,
    getInspectors,
    getLocations,
    getEmployees,
    getPositions
};