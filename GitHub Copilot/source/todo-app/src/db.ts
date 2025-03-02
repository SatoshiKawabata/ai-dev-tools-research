export const connectToDatabase = async () => {
    const mongoose = require('mongoose');

    const dbURI = process.env.DB_URI || 'your-default-database-uri';

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};