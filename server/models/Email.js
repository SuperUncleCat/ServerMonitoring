const mongoose = require('mongoose')

var emailSchema = mongoose.Schema({
    email_address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: null
    },
})

module.exports = emailSchema