const { MongoClient, ServerApiVersion } = require('mongodb')
const ObjectId = require("mongodb").ObjectId
const login = require("./login_mongo")
const BSONTypeError = require("mongodb").BSONTypeError

const uri = login.uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
    global.conn = client.db(login.db_name)
});

async function selectTitles() {
    let values = await global.conn.collection(login.collection_name).find({}, {projection: {Titulo: true}}).toArray()
    
    return values
}

async function loadHistory(id) {
    try{
        id = ObjectId(id)
    }catch(BSONTypeError){
        id = ""
    }
    let value = await global.conn.collection(login.collection_name).findOne({_id: id}, {projection: {_id: false}})
    
    return value
}

module.exports = { selectTitles, loadHistory }
