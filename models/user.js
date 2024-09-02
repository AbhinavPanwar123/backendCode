const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        minLength:[3,'Minimum 3 characters are required'],
        required:[true,'firstName is required']
    },
    lastName:{
        type:String,
        minLength:[3,'Minimum 3 characters are required'],
        required:[true,'lastName is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: [5, 'Min length should be 5 characters'],
        required: [false, 'Password is required']
    }, 
     isVerified: {
        type: Boolean,
        default: false, // Set default to false
      },
      verificationToken: {
        type: String,
      }
});


module.exports = mongoose.model('user', userSchema);