const mongoose = require('mongoose')
const { Schema } = mongoose

const ResidentBill = new Schema({
    license_plate: String,
    total_timing: Number,
    amount: Number,

})

module.exports = mongoose.model('bill', ResidentBill)