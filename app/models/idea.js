var mongoose = require('mongoose');

module.exports = mongoose.model('Idea', {
    text: {
        type: String,
        default: '',
        lowercase: true, 
        trim: true 
    },
    updated: { type: Date, default: Date.now },
    vote: { type: Number, default:0}
});