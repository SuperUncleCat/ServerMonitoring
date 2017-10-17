const mongoose = require('mongoose')

var logSchema = mongoose.Schema({
    ip_address: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    server_name: {
        type: String,
        required: true
    },
    jp_name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = logSchema