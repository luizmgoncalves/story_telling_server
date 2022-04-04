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
    try{
        let values = await global.conn.collection(login.collection_name).find({published: true}, {projection: {Titulo: true}}).toArray()
        return values
    }
    catch(err){
        console.log("Houve o seguinte erro durante a função \"selectTitles\":\n" + err)
        return []
    }
    
}

async function getMyTitles(user_id){
    if (!done){
        return []
    }
    try{
        let values = await global.conn.collection(login.collection_name).find({owner: {$eq: user_id}}, {projection: {Titulo: true, published: true}}).toArray()
        return values
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"getMyTitles\":\n" + err)
        return []
    }
}

async function insertStory(story){
    if (!done){
        return false
    }

    try{
        let res = await global.conn.collection(login.collection_name).insertOne(story)
        return res.acknowledged
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"insertStory\":\n" + err)
        return false
    }
}

async function loadHistory(id) {
    if (!done){
        return {}
    }
    try{
        id = ObjectId(id)
        let value = await global.conn.collection(login.collection_name).findOne({_id: id}, {projection: {_id: false}})
        return value
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"loadHistory\":\n" + err)
        return {}
    }
    
}

async function deleteStory(id){
    if (!done){
        return false
    }
    try{
        id = ObjectId(id)
        let value = await global.conn.collection(login.collection_name).deleteOne({_id: id})
        return value.acknowledged
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"deleteStory\":\n" + err)
        return false
    }
}

async function updateStory(id, json){
    if (!done){
        return false
    }
    try{
        id = ObjectId(id)
        let value = await global.conn.collection(login.collection_name).updateOne({_id: id}, {$set: json})
        return value.acknowledged
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"deleteStory\":\n" + err)
        return false
    }
}

module.exports = { selectTitles, loadHistory, getMyTitles, insertStory, deleteStory, updateStory }
