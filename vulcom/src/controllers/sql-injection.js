import conn from '../database/db.js'

const controller = {};

controller.login = function(req, res) {
  res.render('sql-injection/login', {
    title: 'Autentique-se',
    username: '',
    password: '',
    message: ''
  })
}

controller.processLoginSqlInjection = async function(req, res) {
  try{

    // Usando concatenação de valores em SQL de forma insegura para reproduzir SQL Injection
    // Para reproduzir uma injeção de SQL que apaga a tabela 'users', basta informar a string abaixo no campo 'username'
    // or 1=1; drop table users; --
    const sql = `select * from users where username = '${req.body.username}' and password = '${req.body.password}'`
    
    console.log('-'.repeat(80))
    console.log(sql)
    console.log('-'.repeat(80))

    const result = await conn.query(sql)

    if(result.rowCount > 0) res.render('sql-injection/success', { title: 'Autenticado'})
    else res.render('sql-injection/login', {
      title: 'Autentique-se',
      username: req.body.username,
      password: req.body.password,
      message: 'Usuário ou senha inválidos'
    })
  } catch(error) {
    console.error(error)
    res.render('sql-injection/login', {
      title: 'Autentique-se',
      username: req.body.username,
      password: req.body.password,
      message: error.message
    })
  }
}

controller.processLogin = async function(req, res) {
  try{

    // Para evitar SQL Injection, os valores de 'username' e 'password' serão passados à conexão com o banco de dados como parâmetros
    const sql = `select * from users where username = $1 and password = $2`
    const params = [req.body.username, req.body.password]
    
    console.log('-'.repeat(80))
    console.log(sql)
    console.log('-'.repeat(80))

    // Consulta é feita mesclando o texto do SQL com os parâmetros, de forma segura
    const result = await conn.query(sql, params)

    if(result.rowCount > 0) res.render('sql-injection/success', { title: 'Autenticado'})
    else res.render('sql-injection/login', {
      title: 'Autentique-se',
      username: req.body.username,
      password: req.body.password,
      message: 'Usuário ou senha inválidos'
    })
  } catch(error) {
    console.error(error)
    res.render('sql-injection/login', {
      title: 'Autentique-se',
      username: req.body.username,
      password: req.body.password,
      message: error.message
    })
  }
}

export default controller
