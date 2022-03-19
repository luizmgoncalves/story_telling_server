
let uri_s

try{
    const login = require("./login")
    uri_s = `mongodb+srv://${login.user_name}:${login.password}@cluster0.hbyb1.mongodb.net/${login.db_name}?retryWrites=true&w=majority`
}catch{
    uri_s = process.env.MONGODB_URI
}

const db_name = "json_creator"
const collection_name = "stories"

const uri = uri_s

module.exports = {uri, db_name, collection_name}