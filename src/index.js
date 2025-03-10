const mongoose = require('mongoose')
const {app, PORT} = require('./app')
const dotenv = require('dotenv')
dotenv.config()
const config = require('./config')
const DATE_NOW = new Date()

function startExpress(){
    app.listen(PORT, ()=>{
        console.log(`[${DATE_NOW}] ==> The server is running on ${config.HOST_URL}:${PORT}`)
    })
}

async function initializeMongo(){
    try {                                       
        const client = await mongoose.connect(config.MONGO_DB_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
        console.log(`[${DATE_NOW}] ==> Mongo was initialized`)
        startExpress()
        //When you leave of db
        process.on('SIGINT', async()=>{
            console.log(`[${DATE_NOW}] ==> Mongo was disconnected`)
        })
    } catch (error) {
        console.log(`[${DATE_NOW}] ==> ${error.message}`)
    }
}

initializeMongo()