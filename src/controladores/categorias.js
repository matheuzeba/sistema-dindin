const pool = require('../bancoDeDados/conexao');

const listarCategorias = async(req, res, next) => {
    const { rows } = await pool.query('select * from categorias');

    return res.status(200).json(rows)
}

module.exports = {
    listarCategorias
}