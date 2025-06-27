const sqlite3 = require('sqlite3').verbose(); // .verbose() provides more detailed stack traces
const path = require('path');

// Define the path to your SQLite database file
// It will be created in the root of your project if it doesn't exist
const DB_PATH = path.join(__dirname, '..', 'visits.sqlite');

let db; // Variable to hold the database connection instance

/**
 * Initializes the SQLite database connection and creates the necessary table if it doesn't exist.
 * This function should be called once when the server starts.
 * @returns {Promise<sqlite3.Database>} A promise that resolves with the database instance.
 */
function initializeDb() {
    return new Promise((resolve, reject) => {
        // Open the database connection
        // sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE: open for reading/writing, create if not exists
        db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error(`[DB] Error opening database: ${err.message}`);
                return reject(err);
            }
            console.log(`[DB] Connected to the SQLite database at ${DB_PATH}`);

            // Create the table to store subdomain visit counts if it doesn't exist
            // `subdomain` will be the unique identifier for each website's count
            // `total_visits` and `unique_visits` will store the respective counts
            db.run(`
                CREATE TABLE IF NOT EXISTS subdomain_visits (
                    subdomain TEXT PRIMARY KEY,
                    total_visits INTEGER DEFAULT 0,
                    unique_visits INTEGER DEFAULT 0
                )
            `, (err) => {
                if (err) {
                    console.error(`[DB] Error creating table: ${err.message}`);
                    return reject(err);
                }
                console.log("[DB] 'subdomain_visits' table ensured.");
                resolve(db);
            });
        });
    });
}

/**
 * Gets the singleton database instance.
 * @returns {sqlite3.Database} The database instance. Throws an error if not initialized.
 */
function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDb() first.');
    }
    return db;
}

/**
 * Closes the database connection.
 * Should be called when the server is shutting down.
 */
function closeDb() {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error(`[DB] Error closing database: ${err.message}`);
            } else {
                console.log('[DB] Database connection closed.');
            }
        });
    }
}

module.exports = {
    initializeDb,
    getDb,
    closeDb,
};