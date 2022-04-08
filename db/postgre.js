const bcrypt = require('bcrypt-nodejs');
const res = require('express/lib/response');
const moment = require("moment");

async function connect() {
    if (global.connection){
        return global.connection.connect();
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
        let client = await connect()
        let validade = moment().add(1, 'h').format()

        let sql = `select * from users_sch.users_tb where email = $1`
        let values = [email];
        let result = await client.query(sql, values)
        if(result.rows[0]){
            await client.release()
            return {id: null, email: null}
        }
        sql = "INSERT INTO cadastro.cadastros(username, email, senha, validade) VALUES ($1,$2,$3, $4) returning id, email;"

        values = [username, email, bcrypt.hashSync(senha), validade];
        result = await client.query(sql, values)

        await client.release()

        return result.rows[0]

    } catch(err){
        console.log("Houve o seguinte erro durante a função \"criar_novo_cadastro\":\n" + err)
        return {id: null, email: null}
    }
    
    
}

async function cadastrar_efetivo(id){
    try{
        let client = await connect()
        let sql = 'SELECT * FROM cadastro.cadastros WHERE id=$1'
        let values = [id]
        let result = await client.query(sql, values)
        result = result.rows[0]
        if(!result){
            await client.release()
            return false
        }
        result.validade = moment(result.validade)

        if(moment().isAfter(result.validade) || result.feito == true){
            await client.release()
            return false
        }

        await client.query('UPDATE cadastro.cadastros SET feito = true WHERE email = $1;', [result.email])

        sql = "INSERT INTO users_sch.users_tb(username, email, password) VALUES ($1,$2,$3)"

        values = [result.username, result.email, result.senha]

        await client.query(sql, values)
        await client.release()

        return true

    }catch(err){
        console.log("Houve o seguinte erro durante a função \"cadastrar_efetivo\":\n" + err)
        return false
    }
}

async function find_user_by_id(id){
    let client
    try{
        client = await connect()

        let res =  await client.query("SELECT * FROM users_sch.users_tb WHERE id = $1",[id])

        await client.release()

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
        let client = await connect()
        let res =  await client.query("SELECT * FROM users_sch.users_tb WHERE email = $1",[email])
        await client.release()
        if (res.rows.length==0){
            return null
        }

        return res.rows[0]
    } catch(err){
        console.log("Houve o seguinte erro durante a função \"find_user_by_email\":\n" + err)
        return null
    }
}

async function is_admin(id){
    let client
    try{
        client = await connect()

        let res =  await client.query("SELECT * FROM users_sch.admins WHERE user_id = $1",[id])

        await client.release()

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
        let client = await connect()
        let sql = 'DELETE FROM cadastro.cadastros WHERE id > 0'
        await client.query(sql)
        sql = 'DELETE FROM users_sch.users_tb WHERE id > 0'
        await client.query(sql)
        await client.release()
    }catch(err){
        console.log("Houve o seguinte erro durante a função \"clean_database\":\n" + err)
    }
}

module.exports = {criar_novo_cadastro, cadastrar_efetivo, find_user_by_id, find_user_by_email, is_admin}
