/**
 * Created by jwb19 on 2017-02-14.
 */
const request = require('request')

let dropCollection = (db, collection) => {
    return new Promise((resolve, reject) => {
        db.listCollections({name: collection}).next(function (err, collinfo) {
            if (err) {
                reject(err)
            }
            if (collinfo) {
                db.collection(collection).drop()
                resolve({retVal: 'collection dropped'})
            } else {
                resolve({retVal: 'no such collection to drop'})
            }
        })
    })
}

let findAll = (db, collection) => {
    return db.collection(collection).find().toArray()
}

let getRemoteJson = (srcAddr) => {
    return new Promise((resolve, reject) => {
        request({
            url: srcAddr,
            json: true
        }, (error,response,body) => {
            if (error) {
                reject('unable to connect to servers');
            } else if (response.statusCode === 200) {
                resolve(body)
            }
        })
    })
}

module.exports = {dropCollection, getRemoteJson, findAll}