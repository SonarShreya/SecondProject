const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
       let aa = await mongoose.connect('mongodb://localhost:27017/e-com', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB with Mongoose====================',aa);
    } catch (error) {
        console.error('Error connecting to MongoDB with Mongoose:', error);
    }
};

module.exports = connectToDatabase;
