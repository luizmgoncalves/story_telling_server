async function connect() {
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: 'postgres://json_creator:1234@localhost:5432/histories'

    });

    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");
    client.release();

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

async function selectTitles() {
    const client = await connect();
    const res = await client.query('SELECT (id, titulo) FROM histories.histories');
    return res.rows;
}

async function loadHistory(id) {
    const client = await connect();
    const res = await client.query('SELECT historia FROM histories.histories WHERE id = $1', [id]);
    return res.rows;
}
 
module.exports = { selectTitles, loadHistory }
