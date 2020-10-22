const mongoose = require('mongoose')
const { Schema } = mongoose

const Vehicle = new Schema({
    license_plate: {type: String, required: true},
    vehicle: {type: String, required: true}
})

module.exports = mongoose.model('vehicle', Vehicle)