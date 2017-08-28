/**
 * Created by jwb19 on 2017-02-14.
 */
require('dotenv').config()
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const co = require('co')
const dataRtns = require('./country_rtns')
const utilities = require('./utilities')

// define a default route to retrieve all users
router.get('/', function (req, res) {
    co(function*() {
        let db = yield MongoClient.connect(process.env.DB)
        let countries = yield utilities.findAll(db, "countries")
        res.send(countries)
    }).catch(function(err) {
        console.log(err.stack)
        res.status(500).send('get all countries failed - internal server error')
    })
})

// define a default route to refresh all countries
router.get('/refresh/all', function (req, res) {
    co(function*() {
        let json = yield utilities.getRemoteJson("http://data.okfn.org/data/core/country-list/r/data.json")

        let db = yield MongoClient.connect(process.env.DB)
        let dropResults = yield utilities.dropCollection(db, 'countries')
        if (dropResults)
        {
            console.log('countries dropped')

            yield json.map(item => { // codes come back in json array
                let country = {name: item.Name, code: item.Code}
                let addResults = dataRtns.addOne(country, db)
            })

            var count = yield db.collection('countries').count()
            res.send(JSON.stringify({count:count}))
        }
        else
        {
            console.log('problem dropping countries')
            res.send(JSON.stringify({count:0}))

        }
    }).catch(function(err) {
        console.log(err.stack)
        res.status(500).send('refresh all countries failed - internal server error')
    })
})

module.exports = router

