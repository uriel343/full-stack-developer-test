const Vehicle = require('../models/Register_vehicles')

function createVehicle(req,res){
    let params = req.body
    let vehicle = new Vehicle(params)

    if(params.license_plate && params.vehicle){
        Vehicle.findOne({license_plate: params.license_plate}, (err, vehicleExists)=>{
            if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
            if(vehicleExists) return res.status(400).json({ message: 'Vehicle already exists' })
    
            vehicle.save(err =>{
                if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                return res.status(200).json({ message: 'Success', vehicle: vehicle })
            })
        })
    }else{
        return res.status(400).json({ message: 'Missing parameters, please fill all the blanks' })
    }
}

function showVehicles(req,res){
    Vehicle.find((err,vehiclesFound)=>{
        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
        if(!vehiclesFound) return res.status(404).json({ message: 'Vehicles not found' })
        return res.status(200).json(vehiclesFound)
    })
}

module.exports = {
    createVehicle,
    showVehicles
}