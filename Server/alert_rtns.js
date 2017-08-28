/**
 * Created by jwb19 on 2017-02-14.
 */

let findByCode = (code, db) => {
    return db.collection('alerts').findOne({code: code})
}

let addOne = (alert, db) => {
    return new Promise((resolve, reject) => {
        resolve(db.collection('alerts').insertOne(
            {alert: alert.alert, code: alert.code}
        ))
    })
}

module.exports = {addOne, findByCode}