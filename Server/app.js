/**
 * Created by jwb19 on 2017-01-23.
 */
const countries_rtns = require('./country_routes.js')
const alerts_rtns = require('./alert_routes.js')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(express.static('public'))
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(function(err, req, res, next) {
// Do logging and user-friendly error message display
    console.error(err)
    res.status(500).send('internal server error')
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET")
    res.header("Access-Control-Allow-Headers", "Content-Type: application/json")
    next();
})

// parse application/json
app.use(bodyParser.json())
app.use('/alerts', alerts_rtns)
app.use('/countries', countries_rtns)

app.listen(port, () => {
    console.log(`listening on port ${ port }`)
})

