const mongoose = require("mongoose");

const connectDB = async () => {
    // console.log(process.env.MONGO_URI);
    try {
        const conn = await mongoose.connect("mongodb+srv://anshul12102004:efSzeQgi4OAvoMUw@cluster0.mnef9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;