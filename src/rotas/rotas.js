const express = require('express');
const rotas = express();

const {
    inserirUsuario,
    login,
    perfil,
    atualizarUsuario
} = require('../controladores/usuarios');


const {
    listarCategorias
} = require('../controladores/categorias')

const {
    inserirTransacao,
    listarTransacao,
    listarTransacaoUsuario,
    atualizarTransacao,
    deletarTransacao,
    extrato
} = require('../controladores/transacoes')

const {
    validarNome,
    validarEmail,
    validarSenha,
    validarEmailCadastrado,
    validarEmailLogin
} = require('../intermediarios/validarUsuarios')

const {
    validarTodosOsCampos,
    validarTipo,
    categoriaNome
} = require('../intermediarios/validarTransacoes')

const validarAutorizacao = require('../intermediarios/validarAutorizacao');

// usuarios
rotas.post('/usuario', validarNome, validarEmail, validarSenha, validarEmailCadastrado, inserirUsuario);
rotas.post('/login', validarEmail, validarSenha, validarEmailLogin, login);

rotas.use(validarAutorizacao)

rotas.get('/usuario', perfil);
rotas.put('/usuario', validarNome, validarEmail, validarSenha, validarEmailCadastrado, atualizarUsuario);

// categorias
rotas.get('/categoria', listarCategorias);

// transacoes
rotas.post('/transacao', validarTodosOsCampos, validarTipo, categoriaNome, inserirTransacao);
rotas.get('/transacao', listarTransacao);
rotas.get('/transacao/extrato', extrato);
rotas.get('/transacao/:id', listarTransacaoUsuario);
rotas.put('/transacao/:id', validarTodosOsCampos, validarTipo, categoriaNome, atualizarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);



module.exports = rotas;