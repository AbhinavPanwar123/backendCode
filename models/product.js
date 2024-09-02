const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product name is required'],
        minLength: [3, 'Product name must contain at least 3 characters'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Add Category']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price'],
        min: [0, 'Price should be a positive number']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Quantity must be a positive number']
    },
    photo: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'userSchema',  
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
