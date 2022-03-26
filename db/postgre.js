const bcrypt = require('bcrypt-nodejs');
const res = require('express/lib/response');
const moment = require("moment");
const login_data = require('./login_postgre')

async function connect() {
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');
    const pool = new Pool(login_data.login_data);

    //apenas testando a conexão
    console.log("Criou pool de conexões no PostgreSQL!");

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

async function criar_novo_cadastro(username, email, senha){
    let client = await connect()
    let validade = moment().add(1, 'h').format()

    let sql = `select * from users_sch.users_tb where email = $1`
    let values = [email];
    let result = await client.query(sql, values)
    if(result.rows[0]){
        console.log("já tem")
        return {id: null, email: null}
    }
    sql = "INSERT INTO cadastro.cadastros(username, email, senha, validade) VALUES ($1,$2,$3, $4) returning id, email;"

    values = [username, email, bcrypt.hashSync(senha), validade];
    result = await client.query(sql, values)
    console.log(result.rows[0])
    return result.rows[0]
}

async function cadastrar_efetivo(id){
    let client = await connect()
    let sql = 'SELECT * FROM cadastro.cadastros WHERE id=$1'
    let values = [id]
    let result = await client.query(sql, values)
    result = result.rows[0]
    result.validade = moment(result.validade)

    if(moment().isAfter(result.validade) || result.feito == true){
        return 
    }

    await client.query('UPDATE cadastro.cadastros SET feito = true WHERE id = $1;', [id])

    sql = "INSERT INTO users_sch.users_tb(username, email, password) VALUES ($1,$2,$3)"

    values = [result.username, result.email, result.senha]

    await client.query(sql, values)

    return 
}

async function find_user_by_id(id){
    let client = await connect()
    let res =  await client.query("SELECT * FROM users_sch.users_tb WHERE id = $1",[id])
    if (res.rows.length==0){
        return null
    }
    return res.rows[0]
}

async function find_user_by_email(email){
    let client = await connect()
    let res =  await client.query("SELECT * FROM users_sch.users_tb WHERE email = $1",[email])
    if (res.rows.length==0){
        return null
    }
    return res.rows[0]
}

async function clean_database(){
    let client = await connect()
    let sql = 'DELETE FROM cadastro.cadastros WHERE id > 0'
    await client.query(sql)
}

module.exports = {criar_novo_cadastro, cadastrar_efetivo, find_user_by_id, find_user_by_email}
