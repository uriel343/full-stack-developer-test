const Bill = require('../models/ResidentBill')

function getBills(req,res){
    Bill.find((err, listOfBills)=>{
        if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
        if(!listOfBills) return res.status(404).json({ message: 'Bills not found' })
        return res.status(200).json(listOfBills)
    })
}

module.exports = {
    getBills
}