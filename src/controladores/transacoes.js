const pool = require('../bancoDeDados/conexao');

const inserirTransacao = async(req, res, next) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body

    try {
        const transcacao = await pool.query(
            `
            insert into transacoes(tipo, descricao, valor, data, categoria_id, usuario_id)
            values
            ($1, $2, $3, $4, $5, $6) returning *
            `, [tipo, descricao, valor, data, categoria_id, req.usuario.id]
        );
        
        const retorno = transcacao.rows.map((el) => {
            return {
                id: el.id,
                descricao: el.descricao,
                valor: el.valor,
                data: el.data,
                categoria_id: el.categoria_id,
                usuario_id: el.usuario_id,
                tipo: el.tipo,
                categoria_nome: req.categoria
            }
        })
    
        return res.status(200).json(retorno[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR')
    }


}

const listarTransacao = async(req, res ,next) => {
    try {

        const { rows, rowCount } = await pool.query(
            `
            select * from transacoes where usuario_id = $1
            `, [req.usuario.id]
        );
        
        return res.status(200).json(rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR') 
    }

}

const listarTransacaoUsuario = async(req, res ,next) => {
    const { id } = req.params

    try {

        const { rows, rowCount } = await pool.query(
            `
            select * from transacoes where usuario_id = $1 and id = $2
            `, [req.usuario.id, Number(id)]
        );
    
        if(rowCount === 0) {
            return res.status(404).json({mensagem: "Transação não encontrada."});
        }
    
        return res.status(200).json(rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR') 
    }

}

const atualizarTransacao = async(req, res ,next) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body
    const { id } = req.params

    try {

        const { rows, rowCount } = await pool.query(
            `
            update transacoes
            set
            tipo = $1,
            descricao = $2,
            valor = $3,
            data = $4,
            categoria_id = $5,
            usuario_id = $6
            where
            id = $7 AND usuario_id = $8 returning *
            `, [tipo, descricao, valor, data, categoria_id, req.usuario.id, Number(id), req.usuario.id]
        );
    
        if(rowCount === 0) {
            return res.status(404).json({mensagem: "Transação não encontrada."});
        }
    
        return res.status(200).json(rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR') 
    }

}

const deletarTransacao = async(req, res ,next) => {
    const { id } = req.params

    try {

        const { rows, rowCount } = await pool.query(
            `
            delete from transacoes
            where
            id = $1 AND usuario_id = $2
            `, [Number(id), req.usuario.id]
        );
    
        if(rowCount === 0) {
            return res.status(404).json({mensagem: "Transação não encontrada."});
        }
    
        return res.status(204).json();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR') 
    }

}

const extrato = async(req, res ,next) => {
    try {

        const { rows, rowCount } = await pool.query(
            `
            select valor, tipo from transacoes where usuario_id = $1
            `, [req.usuario.id]
        );
    
        let entrada = rows.filter((el) => {
            return el.tipo === 'entrada'
        })


        if(entrada.length === 0) {
            entrada = 0
        }

        if(entrada.length > 0) {
            entrada = entrada.reduce((valorTotal, atual) => {
                valorTotal.valor + atual.valor
            })
            entrada = entrada.valor
        }

        let saida = rows.filter((el) => {
            return el.tipo === 'saida'
        })

        if(saida.length === 0) {
            saida = 0
        }

        if(saida.length > 0) {
            saida = saida.reduce((valorTotal, atual) => {
                valorTotal.valor + atual.valor
            })

            saida = saida.valor
        }

        console.log(entrada)

        return res.status(200).json({
            entrada,
            saida
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('ERROR') 
    }

}

module.exports = {
    inserirTransacao,
    listarTransacao,
    listarTransacaoUsuario,
    atualizarTransacao,
    deletarTransacao,
    extrato
}