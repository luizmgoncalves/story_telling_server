const { MongoClient, ServerApiVersion } = require('mongodb')
const ObjectId = require("mongodb").ObjectId
const login = require("./login_mongo")

const uri = login.uri
let done = false
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
    if (!err){
        done = true
        global.conn = client.db(login.db_name)
        return
    }
    console.log("Houve um erro na conexão com o banco de dados mango_db: "+ err)
});

async function selectTitles() {
    if (!done){
        return []
    }
    let values = await global.conn.collection(login.collection_name).find({}, {projection: {Titulo: true}}).toArray()
    
    return values
}

async function getMyTitles(user_id){
    if (!done){
        return []
    }
    let values = await global.conn.collection(login.collection_name).find({owner: {$eq: user_id}}, {projection: {Titulo: true}}).toArray()

    return values
}

async function insertStory(story){
    if (!done){
        return false
    }

    try{
        await global.conn.collection(login.collection_name).insertOne(story)
    }catch(err){
        return false
    }

    return true
}

async function loadHistory(id) {
    if (!done){
        return {}
    }
    try{
        id = ObjectId(id)
    }catch(err){
        return {}
    }
    let value = await global.conn.collection(login.collection_name).findOne({_id: id}, {projection: {_id: false}})
    
    return value
}

module.exports = { selectTitles, loadHistory, getMyTitles, insertStory }
