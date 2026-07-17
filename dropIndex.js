require('dotenv').config();
const mongoose = require('mongoose');

async function dropIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        
        // Access the registrations collection
        const db = mongoose.connection.db;
        const collection = db.collection('registrations');
        
        // Drop the email_1 index
        await collection.dropIndex('email_1');
        console.log("Successfully dropped 'email_1' index from registrations collection.");
    } catch (err) {
        if (err.codeName === 'IndexNotFound') {
            console.log("Index 'email_1' not found, maybe already dropped.");
        } else {
            console.error("Error dropping index:", err);
        }
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

dropIndex();
