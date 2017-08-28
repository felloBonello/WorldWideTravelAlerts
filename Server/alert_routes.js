/**
 * Created by jwb19 on 2017-02-14.
 */
require('dotenv').config()
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const co = require('co')
const dataRtns = require('./alert_rtns')
const utilities = require('./utilities')

// define a default route to retrieve all alerts
router.get('/', function (req, res) {
    co(function*() {
        let db = yield MongoClient.connect(process.env.DB)
        let alerts = yield utilities.findAll(db, "alerts")
        res.send(alerts)
    }).catch(function(err) {
        console.log(err.stack)
        res.status(500).send('get all alerts failed - internal server error')
    })
})

// define a default route to retrieve an alert by its code
router.get('/:code', function (req, res) {
    let code = req.params.code
    co(function*() {
        let db = yield MongoClient.connect(process.env.DB)
        let alert = yield dataRtns.findByCode(code, db)
        res.send(alert)
    }).catch(function(err) {
        console.log(err.stack)
        res.status(500).send('get alert failed - internal server error')
    })
})

// define a default route to refresh all alerts
router.get('/refresh/all', function (req, res) {
    co(function*() {
        let json = yield utilities.getRemoteJson("http://data.international.gc.ca/travel-voyage/index-alpha-eng.json")

        let db = yield MongoClient.connect(process.env.DB)
        let dropResults = yield utilities.dropCollection(db, 'alerts')
        if (dropResults)
        {
            console.log('alerts dropped')
            yield Object.keys(json.data).map(function(key, index) { // codes come back in json array
                let alert = {alert: json.data[key].eng['advisory-text'], code: json.data[key]['country-iso']}
                let addResults = dataRtns.addOne(alert, db)
            })

            let countries = yield utilities.findAll(db, "countries")
            for(var c in countries)
            {
                let alert = yield dataRtns.findByCode(countries[c].code, db)
                if(!alert)
                    dataRtns.addOne({alert: "No alerts are currently available", code: countries[c].code}, db)
            }


            var count = yield db.collection('alerts').count()
            res.send(JSON.stringify({count:count}))
        }
        else
        {
            console.log('problem dropping alerts')
            res.send(JSON.stringify({count:0}))
        }

    }).catch(function(err) {
        console.log(err.stack)
        res.status(500).send('refresh all alerts failed - internal server error')
    })
})

module.exports = router
