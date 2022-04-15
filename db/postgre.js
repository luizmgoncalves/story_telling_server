const bcrypt = require('bcrypt-nodejs');
const mongo = require("./mongo");
const moment = require("moment");

async function connect() {
    if (global.connection){
        return global.connection;
    }

    const { Pool } = require('pg');

    function data(){
        try{
            return require('./login_postgre').login_data
        }catch(err){
            return { 
                connectionString: process.env.DATABASE_URL, 
                ssl: {
                    rejectUnauthorized: false,
                }  
            }
        }
    }
    
    const pool = new Pool(data());

    //apenas testando a conexão
    console.log("Criou pool de conexões no PostgreSQL!");

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

async function criar_novo_cadastro(username, email, senha){
    try{
        let pool = await connect()
        let validade = moment().add(1, 'h').format()

        let sql = `select * from users_sch.users_tb where email = $1`
        let values = [email];
        let result = await pool.query(sql, values)

        if(result.rows[0]){
            return {id: null, email: null}
        }

        sql = "INSERT INTO cadastro.cadastros(username, email, senha, validade) VALUES ($1,$2,$3, $4) returning id, email;"

        values = [username, email, bcrypt.hashSync(senha), validade];
        result = await pool.query(sql, values)

        return result.rows[0]

    } catch(err){
        console.log("Houve o seguinte erro durante a função \"criar_novo_cadastro\":\n" + err)
        return {id: null, email: null}
    }
    
    
}

async function cadastrar_efetivo(id){
    try{
        let pool = await connect()
        let sql = 'SELECT * FROM cadastro.cadastros WHERE id=$1'
        let values = [id]
        let result = await pool.query(sql, values)
        result = result.rows[0]

        if(!result){
            return false
        }

        result.validade = moment(result.validade)

        if(moment().isAfter(result.validade) || result.feito == true){
            return false
        }

        await pool.query('UPDATE cadastro.cadastros SET feito = true WHERE email = $1;', [result.email])

        sql = "INSERT INTO users_sch.users_tb(username, email, password) VALUES ($1,$2,$3)"

        values = [result.username, result.email, result.senha]

        await pool.query(sql, values)

        return true

    }catch(err){
        console.log("Houve o seguinte erro durante a função \"cadastrar_efetivo\":\n" + err)
        return false
    }
}

async function find_user_by_id(id){
    let pool
    try{
        pool = await connect()

        let res = await pool.query("SELECT * FROM users_sch.users_tb WHERE id = $1",[id])

        if (res.rows.length==0){
            return null
        }
        return res.rows[0]
    }
    catch(err){
        console.log("Houve o seguinte erro durante a função \"find_user_by_id\":\n" + err)
        return null
    }
}

async function find_user_by_email(email){
    try{
        let pool = await connect()
        let res =  await pool.query("SELECT * FROM users_sch.users_tb WHERE email = $1",[email])

        if (res.rows.length==0){
            return null
        }

        return res.rows[0]
    } catch(err){
        console.log("Houve o seguinte erro durante a função \"find_user_by_email\":\n" + err)
        return null
    }
}

async function story_likes(story_id, user_id){
    if (Object.keys(await mongo.loadHistory(story_id)).length === 0){ //Check if story actually exists
        return false
    }
    let pool
    try{
        pool = await connect()

        let res = {}

        res.likes = await pool.query("SELECT COUNT(*) FROM story_metadata.likes WHERE story_id = $1",[story_id])

        res.likes = res.likes.rows[0]['count']

        if(user_id !== null){
            res.have_liked = await pool.query("SELECT COUNT(*) FROM story_metadata.likes WHERE story_id = $1 AND user_id = $2",[story_id, user_id])

            res.have_liked = res.have_liked.rows[0]['count'] === '1'
        }else{
            res.have_liked = false
        }

        return res
    }
    catch(err){
        console.log("Houve o seguinte erro durante a função \"find_user_by_id\":\n" + err)
        return false
    }
}

async function like(story_id, user_id, unlike=false){
    if (Object.keys( await mongo.loadHistory(story_id)).length === 0){ //Check if story actually exists
        return false
    }
    
    let pool
    try{
        pool = await connect()

        if(!unlike){
            await pool.query("INSERT INTO story_metadata.likes (story_id, user_id) VALUES($1, $2)",[story_id, user_id])
        }else{
            await pool.query("DELETE FROM story_metadata.likes WHERE story_id = $1 AND user_id = $2",[story_id, user_id])
        }

        return true
    }
    catch(err){
        console.log("Houve o seguinte erro durante a função \"like\":\n" + err)
        return false
    }
}

async function is_admin(id){
    let pool
    try{
        pool = await connect()

        let res =  await pool.query("SELECT * FROM users_sch.admins WHERE user_id = $1",[id])

        if (res.rows.length==0){
            return false
        }
        return true
    }
    catch(err){
        console.log("Houve o seguinte erro durante a função \"find_user_by_id\":\n" + err)
        return false
    }
}

async function clean_database(){
    try{
        let pool = await connect()
        let sql = 'DELETE FROM cadastro.cadastros WHERE id > 0'
        await pool.query(sql)
        sql = 'DELETE FROM users_sch.users_tb WHERE id > 0'
        await pool.query(sql)
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"clean_database\":\n" + err)
    }
}

module.exports = {criar_novo_cadastro, cadastrar_efetivo, find_user_by_id, find_user_by_email, is_admin, story_likes, like}
