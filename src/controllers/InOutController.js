const EntryOut = require('../models/In_out')
const Vehicle = require('../models/Register_vehicles')
const Bill = require('../models/ResidentBill')

function entryVehicle(req,res){
    let params = req.body
    var entry = new EntryOut();
    entry.license_plate = params.license_plate,
    entry.vehicle = params.vehicle,
    entry.date = params.date,
    entry.entry_hour = params.entry_hour
    entry.out_hour = ''
    entry.total_timing = 0
    entry.amount = 0
    
    if(params.license_plate && params.vehicle && params.date && params.entry_hour ){
        if(params.vehicle == 'Residente' || params.vehicle == 'Oficial'){
            Vehicle.findOne({license_plate: params.license_plate},(err,vehicleFound)=>{
                if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                if(!vehicleFound){
                    let vehicle = new Vehicle()
                    vehicle.license_plate = params.license_plate
                    vehicle.vehicle = params.vehicle
                    vehicle.save(err=>{
                        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                        entry.save(err=>{
                            if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                            return res.status(200).json({ message: 'Success', entry: entry })
                        })
                    })
                }else{
                    entry.save(err=>{
                        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                        return res.status(200).json({ message: 'Success', entry: entry })
                    })
                }
            })
        }else{
            entry.save(err=>{
                if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
                return res.status(200).json({ message: 'Success', entry: entry })
            })
        }
    }else{
        return res.status(400).json({ message: 'Missing parameters, please fill all the blanks' })
    }
}

function outVehicle(req,res){
    let params = req.body
    var id = req.params.id
    EntryOut.findOne({_id: id},(err,foundEntry)=>{
        if(err) return res.status(500).json({ message: 'Internal server error, please try again 1' })
        if(foundEntry.vehicle == 'No registrado'){
        let timeInit = foundEntry.entry_hour
        let timeOut = params.out_hour
            let diff = Math.abs(new Date(timeInit) - new Date(timeOut))
            let minutes = Math.floor((diff/100)/60)
            let bill = minutes * 0.05
      
        EntryOut.findByIdAndUpdate(id, {out_hour: timeOut, total_timing: minutes, amount: bill},{new: true},(err, closePark)=>{
            if(err) return res.status(500).json({ message: 'Internal server error, please try again 2' })
            if(!closePark) return res.status(404).json({ message: 'Something went wrong, please try again' })
            return res.status(200).json({ message: 'success', parking: closePark })
        })
        }else if(foundEntry.vehicle == 'Oficial'){
            let timeInit = foundEntry.entry_hour
            let timeOut = params.out_hour
            let diff = Math.abs(new Date(timeInit) - new Date(timeOut))
            let minutes = Math.floor((diff/100)/60)
            let bill = 0
        EntryOut.findByIdAndUpdate(id, {out_hour: timeOut,total_timing: minutes, amount: bill},{new: true},(err, closePark)=>{
            if(err) return res.status(500).json({ message: 'Internal server error, please try again 3' })
            if(!closePark) return res.status(404).json({ message: 'Something went wrong, please try again' })
            return res.status(200).json({ message: 'success', parking: closePark })
        })
        }else if(foundEntry.vehicle == 'Residente'){
            var license_plate_resident = foundEntry.license_plate
            Bill.findOne({license_plate: license_plate_resident},(err, billFound)=>{
                if(err) return res.status(500).json({ message: 'Internal server error, please try again 4' })
                    var timeInit = foundEntry.entry_hour
                    var timeOut = params.out_hour
                    var diff = Math.abs(new Date(timeInit) - new Date(timeOut))
                    var minutes = Math.floor((diff/100)/60)
                    var bill = minutes * 0.05
                if(billFound){
                    EntryOut.findByIdAndUpdate(id, {out_hour: timeOut,total_timing: minutes, amount: bill}, {new: true}, (err, success)=>{
                        if(err) return res.status(500).json({ message: 'Internal server error, please try again 6' })
                        if(!success) return res.status(400).json({ message: 'Something went wrong' })
                        Bill.findOneAndUpdate({license_plate: license_plate_resident}, {total_timing: {$sum:minutes},amount: {$sum: bill}},{new: true}, (err)=>{
                            if(err) return res.status(500).json({ message: 'Internal server error, please try again 7' })
                        })
                        return res.status(200).json({ message: 'Success', ok: success })
                    })
                }else{
                    EntryOut.findByIdAndUpdate(id, {out_hour: timeOut,total_timing: minutes, amount: bill}, {new: true}, (err, success)=>{
                        if(err) return res.status(500).json({ message: 'Internal server error, please try again 8' })
                        if(!success) return res.status(400).json({ message: 'Something went wrong' })
                        let bill = new Bill()
                    bill.license_plate = license_plate_resident
                    bill.total_timing = minutes
                    bill.amount = bill
                    bill.save((err)=>{
                        if(err) return res.status(500).json({ message: 'Internal server error, please try again 5' })
                    })
                    return res.status(200).json({ message: 'Success', ok: success })
                    })
                }
            })
            
        }
        
    })

}

function getEntriesAndOuts(req,res){
    EntryOut.find((err,listFound)=>{
        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
        if(!listFound) return res.status(404).json({ message: 'Entries not found' })
        return res.status(200).json(listFound)
    })
}

function cleanHistory(req,res){
    EntryOut.deleteMany((err,ok)=>{
        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
        if(!ok) return res.status(404).json({ message: 'Something went wrong, please try again' })
        return res.status(200).json(ok)
    })
}
module.exports = {
    entryVehicle,
    outVehicle,
    getEntriesAndOuts,
    cleanHistory
}