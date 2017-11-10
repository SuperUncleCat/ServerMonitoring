const mongoose = require('mongoose')

var stateSchema = mongoose.Schema({
    ip_address: {
        type: String,
        required: true
    },
    is_check: {
        type: Boolean,
        default: true
    },
    p_check: {
        type: Boolean,
        default: true
    },
    port: {
        type: Number,
        default: 80
    },
    server_name: {
        type: String,
        required: true
    },
    jp_name: {
        type: String,
        required: true
    },
    port_state: {
        type: String,
        required: true,
        default: "green"
    },
    ping_state: {
        type: String,
        required: true,
        default: "green"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    email_sent: {
        type: Boolean,
        default: false
    },
    email_mark: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
        default: 0
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = stateSchema