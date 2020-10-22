'use strict'
const express = require('express')
const WorkerController = require('../controllers/WokerController')
const Entries = require('../controllers/InOutController')
const Vehicles = require('../controllers/RegisterVehicleController')
const Bills = require('../controllers/BillController')

const api = express.Router()
//Auth routes
api.post('/register', WorkerController.register)
api.post('/login', WorkerController.login)
api.get('/worker', WorkerController.auth)

//In outs of parking routes
api.get('/getEntries', Entries.getEntriesAndOuts)
api.post('/createEntry', Entries.entryVehicle)
api.put('/addOut/:id', Entries.outVehicle)
api.delete('/clearMonth', Entries.cleanHistory)

//Vehicles register of parking routes
api.get('/getVehicles', Vehicles.showVehicles)
api.post('/createVehicle', Vehicles.createVehicle)

//Bill route
api.get('/getBills', Bills.getBills)

module.exports = api