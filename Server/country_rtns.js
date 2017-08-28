/**
 * Created by jwb19 on 2017-02-14.
 */
var ObjectID = require('mongodb').ObjectID

let addOne = (country, db) => {
    return new Promise((resolve, reject) => {
        resolve(db.collection('countries').insertOne(
            {name: country.name, code: country.code}
        ))
    })
}

module.exports = {addOne}