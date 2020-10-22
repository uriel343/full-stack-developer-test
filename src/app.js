'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const config = require('./config')
const routing = require('./routes/routing')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('tiny'))

app.use(routing)

const PORT = config.PORT

module.exports = {
    app,
    PORT
}