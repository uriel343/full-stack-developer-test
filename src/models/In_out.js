const mongoose = require('mongoose')
const { Schema } = mongoose

const In_out = new Schema({
    license_plate: {type: String, required: true},
    vehicle: {type: String, required: true},
    date: {type: Date, required: true},
    entry_hour: {type: String, required: true},
    out_hour: String,
    total_timing: Number,
    amount: Number
})

module.exports = mongoose.model('in_out', In_out)