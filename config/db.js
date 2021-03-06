const mongoose = require('mongoose');


const connectDB = async(dbValue) => {
    try {
        await mongoose.connect(dbValue, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});

    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
}


module.exports = connectDB