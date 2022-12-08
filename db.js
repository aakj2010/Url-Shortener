const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Arslan:admin123@cluster0.jiog1sg.mongodb.net/myurlShortener?retryWrites=true&w=majority')
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB