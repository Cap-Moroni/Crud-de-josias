const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connectionString = 'mysql://root:root@localhost:3306/crud';
    const connection = await mysql.createConnection(connectionString);
    console.log('Conectou no MySQL!');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

async function selectClientes() {
  try {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM clientes;');
    await connection.end(); // Feche a conexão
    return rows;
  } catch (error) {
    console.error('Erro ao selecionar clientes:', error);
    throw error;
  }
}

async function selectCliente(id) {
    const conn = await connect();
    const sql = 'SELECT * FROM clientes WHERE id=?';
    const [rows] = await conn.query(sql, [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  }



  async function insertCliente(cliente) {
    const conn = await connect();
    const sql = "INSERT INTO clientes (nome, idade, uf) VALUES (?, ?, ?)";
    return await conn.query(sql, [cliente.nome, cliente.idade, cliente.uf]);
  }


 async function updateCliente(id, cliente, callback) {
    let sql = "UPDATE clientes SET ";
    const props = Object.entries(cliente);

    for (var i = 0; i < props.length; i++) {
        const item = props[i];

        if (i !== props.length - 1) { // não é o último
            sql += `${item[0]} = ?,`;
        } else {
            sql += `${item[0]} = ? WHERE id = ?`;
        }
    }

    const values = props.map(p => p[1]);
    values.push(id);

    const conn = await connect();
    return await conn.query(sql, values);
}

async function deleteCliente(id) {
    const conn = await connect();
    return await conn.query('DELETE FROM clientes WHERE id=?;', [id]);
}

module.exports = { selectClientes, selectCliente, insertCliente, updateCliente, deleteCliente };