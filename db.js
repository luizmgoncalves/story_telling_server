const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

console.log("Ola")
mongoClient.connect("mongodb://localhost")
            .then(conn => {
                global.conn = conn.db("json_creator")
                console.log("Conectado hehehe")
            })
            .catch(err => console.log(err))

async function selectTitles() {
    let values = await global.conn.collection("stories").find({}, {projection: {Titulo: true}}).toArray()
    
    return values
}

async function loadHistory(id) {
    let value = await global.conn.collection("stories").findOne({_id: ObjectId(id)}, {projection: {_id: false}})
    
    return value
}

module.exports = { selectTitles, loadHistory }
