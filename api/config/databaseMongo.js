const mongoose = require('mongoose')
mongoose.Promise = global.Promise
//mongoose.connect('mongodb://apiBi:apiBI123test@172.21.220.32:27017/AidaBI', { useMongoClient: true })
mongoose.connect('mongodb://127.0.0.1:27017/AidaBI', { useMongoClient: true }) 

